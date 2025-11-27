import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/config'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

/**
 * POST /api/payment/webhook
 * Handle Stripe webhooks
 */
export async function POST(request: NextRequest) {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
        return NextResponse.json(
            { error: 'Missing stripe-signature header' },
            { status: 400 }
        )
    }

    let event: Stripe.Event

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 }
        )
    }

    const supabase = await createClient()

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                await handleCheckoutCompleted(session, supabase)
                break
            }

            case 'invoice.payment_succeeded': {
                // Handle recurring subscription payments
                const invoice = event.data.object as Stripe.Invoice
                await handleInvoicePaymentSucceeded(invoice, supabase)
                break
            }

            case 'customer.subscription.deleted': {
                // Handle subscription cancellation
                const subscription = event.data.object as Stripe.Subscription
                await handleSubscriptionDeleted(subscription, supabase)
                break
            }

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Webhook processing error:', error)
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        )
    }
}

/**
 * Handle successful checkout
 */
async function handleCheckoutCompleted(
    session: Stripe.Checkout.Session,
    supabase: any
) {
    const { userId, productId, credits } = session.metadata!

    console.log('Processing checkout completion:', {
        userId,
        productId,
        credits,
    })

    // Add credits to user
    const { error: creditError } = await supabase.rpc('add_credits', {
        user_id: userId,
        credit_amount: parseInt(credits),
    })

    if (creditError) {
        console.error('Error adding credits:', creditError)
        throw creditError
    }

    // Save transaction
    const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
            user_id: userId,
            type: session.mode === 'subscription' ? 'subscription' : 'purchase',
            amount: session.amount_total! / 100, // Convert from cents to dollars
            credits: parseInt(credits),
            stripe_payment_id: session.payment_intent as string,
            stripe_session_id: session.id,
            status: 'completed',
            metadata: {
                productId,
                sessionId: session.id,
            },
        })

    if (transactionError) {
        console.error('Error saving transaction:', transactionError)
        throw transactionError
    }

    // Update plan if subscription
    if (session.mode === 'subscription' && productId) {
        const plan = productId === 'premium' ? 'premium' : 'pro'
        await supabase
            .from('users')
            .update({ plan })
            .eq('id', userId)
    }

    console.log('Checkout completed successfully')
}

/**
 * Handle recurring subscription payment
 */
async function handleInvoicePaymentSucceeded(
    invoice: Stripe.Invoice,
    supabase: any
) {
    if (!invoice.subscription_details?.metadata) return

    const { userId, credits } = invoice.subscription_details.metadata

    console.log('Processing invoice payment:', { userId, credits })

    // Add credits for recurring payment
    const { error } = await supabase.rpc('add_credits', {
        user_id: userId,
        credit_amount: parseInt(credits),
    })

    if (error) {
        console.error('Error adding recurring credits:', error)
        throw error
    }

    console.log('Recurring payment processed successfully')
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionDeleted(
    subscription: Stripe.Subscription,
    supabase: any
) {
    const { userId } = subscription.metadata

    console.log('Processing subscription deletion:', { userId })

    // Downgrade to free plan
    await supabase
        .from('users')
        .update({ plan: 'free' })
        .eq('id', userId)

    console.log('Subscription cancelled successfully')
}

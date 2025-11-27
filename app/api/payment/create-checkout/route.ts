import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/config'
import { getProduct } from '@/lib/stripe/client-config'

/**
 * POST /api/payment/create-checkout
 * Create a Stripe Checkout session
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Get authenticated user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Parse request body
        const body = await request.json()
        const { productId } = body

        if (!productId) {
            return NextResponse.json(
                { error: 'Missing required field: productId' },
                { status: 400 }
            )
        }

        // Get product details
        const product = getProduct(productId)
        if (!product) {
            return NextResponse.json(
                { error: 'Invalid product ID' },
                { status: 400 }
            )
        }

        // Get user email from Supabase
        const { data: userData } = await supabase
            .from('users')
            .select('email')
            .eq('id', user.id)
            .single()

        const customerEmail = userData?.email || user.email

        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: product.name,
                            description: product.description,
                        },
                        unit_amount: product.price,
                        ...(product.recurring && {
                            recurring: { interval: product.recurring },
                        }),
                    },
                    quantity: 1,
                },
            ],
            mode: product.recurring ? 'subscription' : 'payment',
            success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/credits`,
            customer_email: customerEmail,
            metadata: {
                userId: user.id,
                productId,
                credits: product.credits.toString(),
            },
            ...(product.recurring && {
                subscription_data: {
                    metadata: {
                        userId: user.id,
                        productId,
                        credits: product.credits.toString(),
                    },
                },
            }),
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('Create checkout error:', error)
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        )
    }
}

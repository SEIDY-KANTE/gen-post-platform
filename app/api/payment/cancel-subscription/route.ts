import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/config'

/**
 * POST /api/payment/cancel-subscription
 * Cancel user's Stripe subscription
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

        // Get user's Stripe customer ID from metadata or email
        const { data: userData } = await supabase
            .from('users')
            .select('email')
            .eq('id', user.id)
            .single()

        if (!userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Find customer by email
        const customers = await stripe.customers.list({
            email: userData.email,
            limit: 1,
        })

        if (customers.data.length === 0) {
            return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
        }

        const customer = customers.data[0]

        // Get active subscriptions
        const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'active',
            limit: 1,
        })

        if (subscriptions.data.length === 0) {
            return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
        }

        // Cancel the subscription
        const subscription = subscriptions.data[0]
        await stripe.subscriptions.cancel(subscription.id)

        // Update user plan in database
        await supabase
            .from('users')
            .update({ plan: 'free' })
            .eq('id', user.id)

        return NextResponse.json({ success: true, message: 'Subscription cancelled' })
    } catch (error) {
        console.error('Cancel subscription error:', error)
        return NextResponse.json(
            { error: 'Failed to cancel subscription' },
            { status: 500 }
        )
    }
}

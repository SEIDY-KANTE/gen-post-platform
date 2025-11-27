/**
 * Credit packages and subscription plans
 * Shared between client and server
 */
export const STRIPE_PRODUCTS = {
    // One-time credit purchases
    credits_10: {
        name: '10 Credits Pack',
        description: 'Perfect for trying out AI generation',
        credits: 10,
        price: 200, // $2.00 in cents
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_10 || process.env.STRIPE_PRICE_CREDITS_10,
    },
    credits_20: {
        name: '20 Credits Pack',
        description: 'Perfect for trying out AI generation',
        credits: 20,
        price: 399, // $3.99 in cents
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_20 || process.env.STRIPE_PRICE_CREDITS_20,
    },
    credits_50: {
        name: '50 Credits Pack',
        description: 'Great for regular content creators',
        credits: 50,
        price: 599, // $5.99 in cents
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_50 || process.env.STRIPE_PRICE_CREDITS_50,
    },
    credits_100: {
        name: '100 Credits Pack',
        description: 'Best value for power users',
        credits: 100,
        price: 1200, // $12.00 in cents
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_100 || process.env.STRIPE_PRICE_CREDITS_100,
    },

    // Subscription plans
    premium: {
        name: 'Premium Plan',
        description: 'Monthly subscription with generous credits',
        credits: 60,
        price: 499, // $4.99/month
        recurring: 'month' as const,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM || process.env.STRIPE_PRICE_PREMIUM,
    },
    pro: {
        name: 'Pro Plan',
        description: 'Unlimited creativity for professionals',
        credits: 150,
        price: 999, // $9.99/month
        recurring: 'month' as const,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || process.env.STRIPE_PRICE_PRO,
    },
}

/**
 * Get product by ID
 */
export function getProduct(productId: keyof typeof STRIPE_PRODUCTS) {
    return STRIPE_PRODUCTS[productId]
}

/**
 * Format price for display
 */
export function formatPrice(priceInCents: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(priceInCents / 100)
}

/**
 * Product metadata for Stripe
 */
export function getProductMetadata(productId: string) {
    const product = STRIPE_PRODUCTS[productId as keyof typeof STRIPE_PRODUCTS]
    if (!product) return null

    return {
        productId,
        credits: product.credits.toString(),
        name: product.name,
    }
}

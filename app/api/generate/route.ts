import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateContent } from '@/lib/services/ai.service'

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json()
        const { topic, style, tone, platform } = body

        // Validate required fields
        if (!topic || !style || !tone || !platform) {
            return NextResponse.json(
                { error: 'Missing required fields: topic, style, tone, platform' },
                { status: 400 }
            )
        }

        // Get authenticated user
        const supabase = await createClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized. Please login.' },
                { status: 401 }
            )
        }

        // Check user credits
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('credits')
            .eq('id', user.id)
            .single()

        if (userError) {
            console.error('Error fetching user:', userError)
            return NextResponse.json(
                { error: 'Failed to verify credits' },
                { status: 500 }
            )
        }

        if (!userData || userData.credits <= 0) {
            return NextResponse.json(
                { error: 'Insufficient credits. Please purchase more credits to continue.' },
                { status: 403 }
            )
        }

        // Generate content with AI
        const content = await generateContent({
            topic,
            style,
            tone,
            platform,
        })

        // Deduct credit using atomic function
        const { data: creditDeducted, error: creditError } = await supabase.rpc(
            'deduct_credit',
            {
                user_id: user.id,
            }
        )

        if (creditError || !creditDeducted) {
            console.error('Error deducting credit:', creditError)
            // Return content anyway since generation succeeded
            // But warn about credit issue
            return NextResponse.json({
                content,
                warning: 'Content generated but credit deduction failed',
            })
        }

        // Success response
        return NextResponse.json({
            content,
            creditsRemaining: userData.credits - 1,
        })
    } catch (error) {
        console.error('Generation error:', error)

        // Check if it's an AI-specific error
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message || 'AI generation failed. Please try again.' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
}

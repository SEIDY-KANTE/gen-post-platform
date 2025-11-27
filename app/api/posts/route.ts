import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/posts
 * Fetch all posts for the authenticated user
 */
export async function GET(request: NextRequest) {
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

        // Fetch user's posts
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching posts:', error)
            return NextResponse.json(
                { error: 'Failed to fetch posts' },
                { status: 500 }
            )
        }

        return NextResponse.json({ posts })
    } catch (error) {
        console.error('GET /api/posts error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/posts
 * Create a new post
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
        const {
            title,
            content,
            template_id,
            platform,
            thumbnail_url,
            author,
            design_config,
        } = body

        // Validate required fields
        if (!title || !content) {
            return NextResponse.json(
                { error: 'Missing required fields: title, content' },
                { status: 400 }
            )
        }

        // Insert post
        const { data: post, error } = await supabase
            .from('posts')
            .insert({
                user_id: user.id,
                title,
                content,
                template_id,
                platform,
                thumbnail_url,
                author,
                design_config,
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating post:', error)
            return NextResponse.json(
                { error: 'Failed to create post' },
                { status: 500 }
            )
        }

        return NextResponse.json({ post }, { status: 201 })
    } catch (error) {
        console.error('POST /api/posts error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

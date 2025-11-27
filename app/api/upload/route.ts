import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/upload
 * Upload an image to Supabase Storage
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

        // Parse form data
        const formData = await request.formData()
        const file = formData.get('file') as File
        const bucket = (formData.get('bucket') as string) || 'backgrounds'

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only PNG, JPEG, and WebP are allowed.' },
                { status: 400 }
            )
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 5MB.' },
                { status: 400 }
            )
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false,
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return NextResponse.json(
                { error: 'Failed to upload file' },
                { status: 500 }
            )
        }

        // Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(data.path)

        return NextResponse.json({
            url: publicUrl,
            path: data.path,
            bucket,
        })
    } catch (error) {
        console.error('POST /api/upload error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/upload
 * Delete an image from Supabase Storage
 */
export async function DELETE(request: NextRequest) {
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
        const { path, bucket = 'backgrounds' } = body

        if (!path) {
            return NextResponse.json(
                { error: 'Missing required field: path' },
                { status: 400 }
            )
        }

        // Verify the file belongs to the user (path should start with user.id)
        if (!path.startsWith(user.id)) {
            return NextResponse.json(
                { error: 'Forbidden: Cannot delete files from other users' },
                { status: 403 }
            )
        }

        // Delete from storage
        const { error: deleteError } = await supabase.storage
            .from(bucket)
            .remove([path])

        if (deleteError) {
            console.error('Delete error:', deleteError)
            return NextResponse.json(
                { error: 'Failed to delete file' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('DELETE /api/upload error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

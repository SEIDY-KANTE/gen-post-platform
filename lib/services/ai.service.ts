import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

// Initialize AI clients
const geminiApiKey = process.env.GEMINI_API_KEY
const openaiApiKey = process.env.OPENAI_API_KEY
// Veo3 is the correct spelling; accept legacy VO3 env var as a fallback
const veo3ApiKey = process.env.VEO3_API_KEY || process.env.VO3_API_KEY

const gemini = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null
const openai = openaiApiKey
    ? new OpenAI({
          apiKey: openaiApiKey,
      })
    : null

export interface GenerateContentParams {
    topic: string
    style: string
    tone: string
    platform: string
}

export interface AiImageResponse {
    url: string
    source: 'gemini' | 'openai' | 'pollinations' | 'mock'
}

export interface AiVideoResponse {
    url: string
    source: 'gemini' | 'openai' | 'veo3' | 'mock'
    taskId?: string
}

/**
 * Generate social media content using AI
 * Primary: Gemini AI
 * Fallback: OpenAI (GPT-4)
 */
export async function generateContent(
    params: GenerateContentParams
): Promise<string> {
    const { topic, style, tone, platform } = params

    // Build the prompt
    const prompt = buildPrompt(params)

    try {
        // Try Gemini first (primary AI)
        console.log('🤖 Attempting generation with Gemini...')
        const content = await generateWithGemini(prompt)
        console.log('✅ Gemini generation successful')
        return content
    } catch (geminiError) {
        console.warn('⚠️ Gemini failed, falling back to OpenAI:', geminiError)

        try {
            // Fallback to OpenAI
            const content = await generateWithOpenAI(prompt, style, platform)
            console.log('✅ OpenAI fallback successful')
            return content
        } catch (openaiError) {
            console.error('❌ Both AI providers failed')
            console.error('Gemini error:', geminiError)
            console.error('OpenAI error:', openaiError)
            throw new Error('AI generation failed. Please try again later.')
        }
    }
}

/**
 * Generate content using Gemini
 */
/**
 * Generate content using Gemini
 */
async function generateWithGemini(prompt: string): Promise<string> {
    if (!gemini) {
        throw new Error('Gemini API key is missing')
    }
    // Use gemini-1.5-flash-001 for specific version stability
    const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    if (!text) {
        throw new Error('Gemini returned empty response')
    }

    return text.trim()
}

/**
 * Generate content using OpenAI
 */
async function generateWithOpenAI(
    prompt: string,
    style: string,
    platform: string
): Promise<string> {
    if (!openai) {
        throw new Error('OpenAI API key is missing')
    }
    const completion = await openai.chat.completions.create({
        // Use gpt-4o as the flagship model (since user has a new key)
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: `You are a professional social media content creator specializing in ${platform}. Create engaging, ${style} content that captures attention and drives engagement.`,
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        max_tokens: 200,
        temperature: 0.8,
    })

    const text = completion.choices[0]?.message?.content

    if (!text) {
        throw new Error('OpenAI returned empty response')
    }

    return text.trim()
}

// ---------------------------------------------------------------------------
// Image generation (Gemini -> OpenAI -> Pollinations mock)
// ---------------------------------------------------------------------------

async function generateImageWithGemini(prompt: string): Promise<AiImageResponse | null> {
    if (!gemini) return null
    try {
        const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' })
        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [{ text: prompt }],
                },
            ],
            generationConfig: {
                // Asking for an image as base64
                responseMimeType: 'image/png',
            } as any,
        })

        const inline =
            result?.response?.candidates?.[0]?.content?.parts?.find((p: any) => p?.inlineData)?.inlineData
        const base64 = inline?.data
        if (!base64) return null
        return { url: `data:image/png;base64,${base64}`, source: 'gemini' }
    } catch (error) {
        console.error('Gemini image generation failed', error)
        return null
    }
}

async function generateImageWithOpenAI(prompt: string): Promise<AiImageResponse | null> {
    if (!openai) return null
    try {
        const res = await openai.images.generate({
            model: 'gpt-image-1',
            prompt,
            size: '1024x1024',
            n: 1,
        })
        const url = res.data?.[0]?.url
        if (!url) return null
        return { url, source: 'openai' }
    } catch (error) {
        console.error('OpenAI image generation failed', error)
        return null
    }
}

export async function generateImage(prompt: string): Promise<AiImageResponse> {
    const cleaned = prompt.trim()
    if (!cleaned) throw new Error('Prompt is required')

    const geminiImage = await generateImageWithGemini(cleaned)
    if (geminiImage) return geminiImage

    const openaiImage = await generateImageWithOpenAI(cleaned)
    if (openaiImage) return openaiImage

    // Pollinations fallback (no persistence)
    const width = 720
    const height = 1280
    return {
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleaned)}?width=${width}&height=${height}&nologo=true`,
        source: 'pollinations',
    }
}

// ---------------------------------------------------------------------------
// Video generation (Gemini -> OpenAI -> Veo3 -> Mock)
// ---------------------------------------------------------------------------

async function generateVideoWithGemini(_prompt: string): Promise<AiVideoResponse | null> {
    // Placeholder: Gemini video not available in this stack yet
    return null
}

async function generateVideoWithOpenAI(_prompt: string): Promise<AiVideoResponse | null> {
    // Placeholder: OpenAI video generation not available in this stack yet
    return null
}

async function generateVideoWithVeo3(prompt: string): Promise<AiVideoResponse | null> {
    if (!veo3ApiKey) return null
    try {
        const res = await fetch('https://veo3api.com/generate', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${veo3ApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt,
                model: 'veo3-fast',
                watermark: 'veo',
            }),
        })
        if (!res.ok) {
            console.error('Veo3 API error', await res.text())
            return null
        }
        const data = await res.json()
        const taskId = data?.data?.task_id || data?.task_id
        const directUrl = data?.data?.video_url || data?.data?.output_url

        return {
            url:
                directUrl ||
                (taskId ? `https://veo3api.com/tasks/${taskId}` : undefined) ||
                `https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4`,
            source: 'veo3',
            taskId,
        }
    } catch (error) {
        console.error('Veo3 generation failed', error)
        return null 
    }
}

export async function generateVideo(prompt: string): Promise<AiVideoResponse> {
    const cleaned = prompt.trim()
    if (!cleaned) throw new Error('Prompt is required')

    const geminiVideo = await generateVideoWithGemini(cleaned)
    if (geminiVideo) return geminiVideo

    const openaiVideo = await generateVideoWithOpenAI(cleaned)
    if (openaiVideo) return openaiVideo

    const veo3Video = await generateVideoWithVeo3(cleaned)
    if (veo3Video) return veo3Video

    // Mock fallback video clip
    return {
        url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
        source: 'mock',
    }
}

/**
 * Build AI prompt based on parameters
 */
function buildPrompt(params: GenerateContentParams): string {
    const { topic, style, tone, platform } = params

    // Platform-specific guidelines
    const platformGuidelines: Record<string, string> = {
        'instagram-square': 'Instagram post (max 2200 characters, use emojis sparingly)',
        'instagram-story': 'Instagram story (short, punchy, engaging)',
        tiktok: 'TikTok caption (very short, trendy, hook-first)',
        facebook: 'Facebook post (conversational, community-focused)',
        twitter: 'X/Twitter post (max 280 characters, concise and impactful)',
        linkedin: 'LinkedIn post (professional, value-driven, thought leadership)',
    }

    // Style-specific instructions
    const styleInstructions: Record<string, string> = {
        motivational:
            'Inspire and uplift. Use powerful language that drives action.',
        business:
            'Professional and results-oriented. Focus on value propositions.',
        educational:
            'Informative and clear. Break down complex topics simply.',
        humorous: 'Light-hearted and entertaining. Use wit and relatability.',
        inspirational:
            'Empowering and aspirational. Paint a vision of possibility.',
        promotional:
            'Compelling and action-oriented. Create urgency and desire.',
    }

    // Tone-specific modifiers
    const toneModifiers: Record<string, string> = {
        professional: 'formal, credible, and authoritative',
        casual: 'friendly, approachable, and conversational',
        friendly: 'warm, supportive, and personable',
        authoritative: 'confident, expert, and definitive',
        playful: 'fun, creative, and energetic',
    }

    const platformGuide = platformGuidelines[platform] || 'social media post'
    const styleInstruction = styleInstructions[style] || ''
    const toneModifier = toneModifiers[tone] || 'engaging'

    return `Create a ${style} ${platformGuide} about: "${topic}"

Style: ${styleInstruction}
Tone: ${toneModifier}

Requirements:
- Make it ${tone} and ${style}
- Optimize for ${platform}
- Keep it concise and impactful
- Focus on the core message
- DO NOT include hashtags (they will be added separately)
- DO NOT include meta-commentary or explanations
- Return ONLY the post content
- CRITICAL: Keep the text UNDER 50 WORDS (max 280 characters) to ensure it fits in the design.
- Use short sentences and punchy phrasing.
- NO introductory text like "Here is the post:".
- LANGUAGE: Detect the language of the topic ("${topic}") and generate the response in the SAME language. (e.g. if topic is French, output French).

Post content:`
}

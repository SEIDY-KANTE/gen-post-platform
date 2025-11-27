import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

// Initialize AI clients
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
})

export interface GenerateContentParams {
    topic: string
    style: string
    tone: string
    platform: string
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

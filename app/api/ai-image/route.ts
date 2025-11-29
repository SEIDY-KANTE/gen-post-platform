import { NextResponse } from "next/server"

interface AiImageResponse {
  url: string
  source: "gemini" | "openai" | "mock"
}

async function generateWithGemini(prompt: string): Promise<AiImageResponse | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagegeneration:generate?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          aspectRatio: "1:1",
        }),
      },
    )

    if (!res.ok) {
      console.error("Gemini image API error", await res.text())
      return null
    }

    const data = await res.json()
    // Expecting base64 image data in data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data
    const base64 =
      data?.candidates?.[0]?.content?.parts?.find((p: any) => p?.inlineData)?.inlineData?.data ?? null
    if (!base64) return null

    const url = `data:image/png;base64,${base64}`
    return { url, source: "gemini" }
  } catch (error) {
    console.error("Gemini image generation failed", error)
    return null
  }
}

async function generateWithOpenAI(prompt: string): Promise<AiImageResponse | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        response_format: "url",
      }),
    })

    if (!res.ok) {
      console.error("OpenAI image API error", await res.text())
      return null
    }

    const data = await res.json()
    const url = data?.data?.[0]?.url as string | undefined
    if (!url) return null

    return { url, source: "openai" }
  } catch (error) {
    console.error("OpenAI image generation failed", error)
    return null
  }
}

export async function POST(req: Request) {
  try {
    const { prompt } = (await req.json()) as { prompt?: string }
    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // 1) Gemini primary
    const gemini = await generateWithGemini(prompt.trim())
    if (gemini) {
      return NextResponse.json(gemini satisfies AiImageResponse)
    }

    // 2) OpenAI fallback
    const openai = await generateWithOpenAI(prompt.trim())
    if (openai) {
      return NextResponse.json(openai satisfies AiImageResponse)
    }

    // 3) Mock placeholder
  const width = 720
  const height = 1280
  const mock: AiImageResponse = {
    url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true`,
    source: "mock",
  }
    return NextResponse.json(mock)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Generation failed" }, { status: 500 })
  }
}

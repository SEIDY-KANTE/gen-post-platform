import { NextResponse } from "next/server"
import { generateVideo } from "@/lib/services/ai.service"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { prompt } = (await req.json()) as { prompt?: string }
    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Auth + plan/credit gating
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("plan, credits")
      .eq("id", user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: "Unable to verify plan" }, { status: 500 })
    }

    if (!["premium", "pro"].includes(userData.plan)) {
      return NextResponse.json({ error: "Upgrade required" }, { status: 403 })
    }

    if ((userData.credits ?? 0) <= 0) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 403 })
    }

    const result = await generateVideo(prompt)

    // Best-effort credit deduction
    await supabase.rpc("deduct_credit", { user_id: user.id })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Video generation failed", error)
    return NextResponse.json({ error: "Generation failed" }, { status: 500 })
  }
}

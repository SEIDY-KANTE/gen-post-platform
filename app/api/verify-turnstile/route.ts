import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json()

        if (!token) {
            return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 })
        }

        // Verify Turnstile token with Cloudflare
        const formData = new URLSearchParams()
        formData.append("secret", process.env.TURNSTILE_SECRET_KEY!)
        formData.append("response", token)

        const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })

        const verifyJson = await verifyRes.json()

        if (!verifyJson.success) {
            console.error("Turnstile verification failed:", verifyJson)
            return NextResponse.json({ success: false, error: "Verification failed" }, { status: 400 })
        }

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (err: any) {
        console.error("Turnstile verification error:", err)
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
    }
}

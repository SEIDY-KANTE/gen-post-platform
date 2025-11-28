import { NextRequest, NextResponse } from "next/server"
import * as Brevo from "@getbrevo/brevo"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, email, subject, message, "cf-turnstile-response": token } = body

        // Validate required fields
        if (!name || !email || !message || !token) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
        }

        // 1️⃣ Verify Cloudflare Turnstile captcha server-side
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
            return NextResponse.json({ error: "Security verification failed. Please try again." }, { status: 400 })
        }

        // 2️⃣ Send email via Brevo
        const apiInstance = new Brevo.TransactionalEmailsApi()
        apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!)

        const emailData: Brevo.SendSmtpEmail = {
            to: [{ email: process.env.CONTACT_RECEIVER! }],
            sender: { email: process.env.CONTACT_RECEIVER || "noreply@genpost.app", name: "GenPost Contact Form" },
            replyTo: { email, name },
            subject: subject || `New Contact Form Submission from ${name}`,
            htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${subject ? `<p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>` : ""}
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #667eea;">Message:</h3>
            <div style="padding: 15px; background-color: #fff; border-left: 3px solid #667eea; white-space: pre-wrap;">
${message}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
            <p>This email was sent from the GenPost contact form.</p>
            <p>Reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
        }

        await apiInstance.sendTransacEmail(emailData)

        return NextResponse.json({ success: true, message: "Email sent successfully" }, { status: 200 })
    } catch (err: any) {
        console.error("Contact form API error:", err)

        // Handle specific Brevo errors
        if (err.response?.body) {
            console.error("Brevo error:", err.response.body)
            return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 })
        }

        return NextResponse.json({ error: "Server error. Please try again later." }, { status: 500 })
    }
}

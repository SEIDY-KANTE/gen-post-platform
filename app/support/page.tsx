"use client"

import type React from "react"

import { useState } from "react"
import Script from "next/script"
import axios from "axios"
import Link from "next/link"
import { ArrowLeft, Sparkles, Mail, MessageSquare, FileQuestion, Send, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"

const faqs = [
  {
    question: "How do credits work?",
    answer:
      "Credits are used for AI-generated content. Each AI generation costs 1 credit. Free users start with 5 credits, and you can purchase more credits or subscribe to a plan for monthly credits.",
  },
  {
    question: "Can I use GenPost for commercial purposes?",
    answer:
      "Yes! All content you create with GenPost is yours to use commercially. There are no restrictions on how you use your generated posts.",
  },
  {
    question: "What image formats are supported for export?",
    answer:
      "GenPost supports PNG and JPG exports. PNG is recommended for best quality, while JPG offers smaller file sizes.",
  },
  {
    question: "How do I upgrade to Pro?",
    answer:
      "You can upgrade to Pro from the Credits page in your dashboard or from the Pricing section on our homepage. Pro gives you 100 credits/month and access to premium templates.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes, you can cancel your subscription at any time from your Profile page. You'll continue to have access until the end of your billing period.",
  },
  {
    question: "What platforms are supported?",
    answer:
      "GenPost supports all major social media platforms including Instagram (square, portrait, stories), Twitter/X, Facebook, LinkedIn, and Pinterest with optimized dimensions for each.",
  },
]

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    // Get Turnstile response token
    const turnstileResponse = (window as any).turnstile?.getResponse()
    if (!turnstileResponse) {
      setError("Please complete the security verification")
      setIsSubmitting(false)
      return
    }

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      setIsSubmitting(false)
      return
    }

    try {
      const res = await axios.post("/api/contact", {
        ...formData,
        "cf-turnstile-response": turnstileResponse,
      })

      if (res.data.success) {
        setSubmitted(true)
        setFormData({ name: "", email: "", subject: "", message: "" })
          // Reset Turnstile widget
          ; (window as any).turnstile?.reset()

        // Reset form after 5 seconds
        setTimeout(() => {
          setSubmitted(false)
        }, 5000)
      } else {
        setError(res.data.error || "Failed to send message. Please try again.")
      }
    } catch (err: any) {
      console.error("Contact form error:", err)
      setError(err.response?.data?.error || "Server error. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">GenPost</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">How can we help?</h1>
          <p className="mt-4 text-lg text-muted-foreground">Get support, find answers, or reach out to our team</p>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FileQuestion className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">FAQs</CardTitle>
              <CardDescription>Find quick answers below</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Email Support</CardTitle>
              <CardDescription>support@genpost.app</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Response Time</CardTitle>
              <CardDescription>Within 24 hours</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="mt-6">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold">Send us a message</h2>
            <Card className="mt-6">
              <CardContent className="pt-6">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Message Sent!</h3>
                    <p className="mt-2 text-muted-foreground">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Describe your issue or question..."
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Cloudflare Turnstile */}
                    <div className="flex justify-center">
                      <div
                        className="cf-turnstile"
                        data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                        data-theme="light"
                      ></div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Load Cloudflare Turnstile Script */}
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
    </div>
  )
}

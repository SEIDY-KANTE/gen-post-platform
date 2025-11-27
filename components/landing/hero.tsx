"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Zap, ImageIcon, Download } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute right-0 top-1/2 h-[400px] w-[400px] rounded-full bg-accent/20 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Design Studio
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Create stunning
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              social media posts
            </span>
            in seconds
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty sm:text-xl">
            Generate professional designs for Instagram, Facebook, TikTok, LinkedIn, and more. Powered by AI to match
            your brand style perfectly.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/login">
              <Button size="lg" className="gap-2 px-8">
                Start Creating Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#templates">
              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                View Templates
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">No credit card required. 5 free credits to start.</p>
        </div>

        {/* Feature highlights */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">AI Generation</h3>
            <p className="text-sm text-muted-foreground">Describe your idea, AI creates the perfect post</p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <ImageIcon className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold">Pro Templates</h3>
            <p className="text-sm text-muted-foreground">100+ professionally designed templates</p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">One-Click Export</h3>
            <p className="text-sm text-muted-foreground">Download optimized for any platform</p>
          </div>
        </div>
      </div>
    </section>
  )
}

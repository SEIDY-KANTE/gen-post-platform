"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const templates = [
  {
    id: 1,
    name: "Motivational Quote",
    category: "Quote",
    gradient: "from-primary to-accent",
    preview: "Dream big, start small, act now.",
  },
  {
    id: 2,
    name: "Business Promo",
    category: "Marketing",
    gradient: "from-orange-500 to-red-500",
    preview: "Limited Time Offer",
  },
  {
    id: 3,
    name: "Educational Tip",
    category: "Education",
    gradient: "from-blue-500 to-cyan-500",
    preview: "Did you know?",
  },
  {
    id: 4,
    name: "Minimalist",
    category: "Minimal",
    gradient: "from-gray-700 to-gray-900",
    preview: "Less is more.",
  },
  {
    id: 5,
    name: "Bold Statement",
    category: "Marketing",
    gradient: "from-pink-500 to-purple-500",
    preview: "Make it happen.",
  },
  {
    id: 6,
    name: "Corporate",
    category: "Business",
    gradient: "from-slate-600 to-slate-800",
    preview: "Professional Excellence",
  },
]

export function TemplatesPreview() {
  return (
    <section id="templates" className="bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Beautiful templates for every need</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start with a template or create from scratch. Each one is fully customizable.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-primary/50 hover:shadow-xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-90`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
                <p className="text-sm font-bold sm:text-lg">{template.preview}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <Badge variant="secondary" className="text-xs">
                  {template.category}
                </Badge>
                <p className="mt-1 text-sm font-medium text-white">{template.name}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/templates">
            <Button variant="outline" size="lg" className="gap-2 bg-transparent">
              View All Templates
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

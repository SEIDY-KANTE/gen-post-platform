"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, PlayCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n"

const templates = [
  {
    id: 1,
    name: "Motivational Quote",
    category: "Quote",
    gradient: "from-primary via-primary/60 to-accent",
    preview: "Dream big, start small, act now.",
    tall: true,
  },
  {
    id: 2,
    name: "Business Promo",
    category: "Marketing",
    gradient: "from-orange-500 via-amber-400 to-red-500",
    preview: "Limited Time Offer",
  },
  {
    id: 3,
    name: "Educational Tip",
    category: "Education",
    gradient: "from-blue-500 via-cyan-400 to-cyan-600",
    preview: "Did you know?",
    tall: true,
  },
  {
    id: 4,
    name: "Minimalist",
    category: "Minimal",
    gradient: "from-slate-700 to-slate-900",
    preview: "Less is more.",
  },
  {
    id: 5,
    name: "Bold Statement",
    category: "Marketing",
    gradient: "from-pink-500 via-fuchsia-500 to-purple-600",
    preview: "Make it happen.",
  },
  {
    id: 6,
    name: "Corporate",
    category: "Business",
    gradient: "from-slate-600 via-slate-700 to-slate-900",
    preview: "Professional Excellence",
  },
]

export function TemplatesPreview() {
  const { t } = useI18n()
  return (
    <section id="templates" className="bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("templatesPreview.title", "Beautiful templates for every need")}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("templatesPreview.subtitle", "Start with a template or create from scratch. Each one is fully customizable.")}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
          {[t("templatesPreview.filters.all", "Tous"), t("templatesPreview.filters.quotes", "Quotes"), t("templatesPreview.filters.marketing", "Marketing"), t("templatesPreview.filters.education", "Education"), t("templatesPreview.filters.minimal", "Minimal"), t("templatesPreview.filters.motion", "Motion")].map((filter) => (
            <button
              key={filter}
              className="rounded-full border border-border/60 bg-card/70 px-4 py-2 text-muted-foreground transition hover:border-primary/60 hover:text-foreground"
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg shadow-primary/5 transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl ${
                template.tall ? "row-span-2 aspect-[2/3]" : "aspect-[4/5]"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-90`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
                <p className="text-sm font-bold sm:text-lg">{template.preview}</p>
                <span className="mt-2 rounded-full bg-white/15 px-3 py-1 text-xs">
                  {t("templatesPreview.swap", "Swap colorway")}
                </span>
              </div>
              <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 text-xs text-white/80">
                <Badge variant="secondary" className="border border-white/30 bg-white/20 text-[11px] text-white">
                  {template.category}
                </Badge>
                <span className="rounded-full bg-white/15 px-2 py-1">1080x1350</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
                <div>
                  <p className="font-semibold">{template.name}</p>
                  <p className="text-xs text-white/80">
                    {t("templatesPreview.editable", "Editable - locked layers")}
                  </p>
                </div>
                <PlayCircle className="h-6 w-6" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <Link href="/templates">
            <Button variant="outline" size="lg" className="gap-2 bg-transparent">
              {t("templatesPreview.cta", "See full library")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">{t("templatesPreview.note", "New motion series every week.")}</p>
        </div>
      </div>
    </section>
  )
}

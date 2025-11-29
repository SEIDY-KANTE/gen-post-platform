"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Zap, ImageIcon, Download, ShieldCheck, Clock3, BarChart3 } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useAuth } from "@/lib/hooks/useAuth"

export function HeroSection() {
  const { t } = useI18n()
  const { user } = useAuth()
  const primaryHref = user ? "/dashboard" : "/login"
  return (
    <section className="relative overflow-hidden pt-28 pb-24 sm:pt-32 sm:pb-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklch,var(--primary)_20%,transparent),transparent_30%),radial-gradient(circle_at_80%_0%,color-mix(in_oklch,var(--accent)_30%,transparent),transparent_35%)] opacity-80 blur-3xl" />
        <div className="grain absolute inset-0 opacity-60 mix-blend-overlay" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr,0.95fr] lg:px-8">
        <div className="space-y-7 animate-fade-up [animation-delay:80ms]">
          <Badge variant="secondary" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-foreground/80 ring-1 ring-white/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {t("hero.badge", "Studio IA")}
            <span className="text-muted-foreground">Motion ready</span>
          </Badge>

          <div className="space-y-3">
            <h1 className="text-4xl font-semibold leading-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
              {t("hero.title.line1", "Le studio IA qui fait des posts")}
              <span className="block text-gradient">{t("hero.title.line2", "impossibles à ignorer.")}</span>
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              {t(
                "hero.subtitle",
                "Brief en une phrase, canvas généré en 15s. Templates motion, respect de ta charte, exports auto pour Instagram, TikTok, LinkedIn et plus.",
              )}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={primaryHref}>
              <Button size="lg" className="gap-2 rounded-full px-8">
                {t("hero.cta.primary", "Lancer un design")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#templates">
              <Button variant="ghost" size="lg" className="rounded-full px-6 text-foreground hover:bg-white/10">
                {t("hero.cta.secondary", "Voir les templates")}
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {t("hero.trust.reviews", "4.9/5 - 2k créateurs")}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-2">
              <Clock3 className="h-4 w-4 text-accent" />
              {t("hero.trust.time", "15s du brief à l’aperçu")}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              {t("hero.trust.engagement", "+38% d’engagement moyen")}
            </div>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:160ms]">
          <div className="absolute inset-0 -z-10 scale-105 blur-3xl" aria-hidden />
          <div className="backdrop-glass relative overflow-hidden rounded-3xl border border-white/10 p-5 shadow-2xl animate-float">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("hero.canvas.title", "AI Canvas")}</p>
                  <p className="font-semibold text-foreground">{t("hero.canvas.subtitle", "Quote social • 1080x1350")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">{t("hero.canvas.live", "Live")}</span>
                <Button size="sm" variant="outline" className="rounded-full border-white/10 bg-white/5 text-white">
                  {t("hero.canvas.export", "Export")}
                </Button>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-accent/10 p-5">
              <div className="flex items-center justify-between text-xs text-white/80">
                <span>{t("hero.canvas.scene", "Scene • 12 layers")}</span>
                <span className="rounded-full bg-white/10 px-3 py-1">{t("hero.canvas.platforms", "IG / TikTok")}</span>
              </div>
              <div className="relative mt-4 aspect-[4/5] rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_30%_20%,#22d3ee_15%,transparent_28%),radial-gradient(circle_at_80%_60%,#f59e0b_12%,transparent_24%)] from-primary/30 to-accent/30 p-5 shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20" />
                <div className="relative flex h-full flex-col justify-between text-white">
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-white/15 px-3 py-1">{t("hero.canvas.palette", "Slate palette")}</span>
                    <span className="rounded-full bg-white/10 px-2 py-1">{t("hero.canvas.motion", "Motion")}</span>
                  </div>
                  <div className="space-y-3 text-center">
                    <p className="text-sm uppercase tracking-[0.25em] text-white/70">GenPost</p>
                    <p className="text-3xl font-semibold leading-snug sm:text-4xl">
                      {t("hero.title.line1", "Crée des posts qui")}
                      <br />
                      <span className="text-cyan-200">{t("hero.title.line2", "convertissent")}</span>.
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/80">
                    <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                      <ImageIcon className="h-4 w-4" />
                      {t("hero.canvas.templates", "Premium templates")}
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                      <Download className="h-4 w-4" />
                      {t("hero.canvas.export", "PNG / MP4")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-border/80 bg-card/60 px-4 py-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  {t("hero.canvas.metrics.gen", "AI generations")}
                </div>
                <p className="mt-2 text-2xl font-semibold text-foreground">+12</p>
              </div>
              <div className="rounded-2xl border border-border/80 bg-card/60 px-4 py-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock3 className="h-4 w-4 text-accent" />
                  {t("hero.canvas.metrics.saved", "Time saved")}
                </div>
                <p className="mt-2 text-2xl font-semibold text-foreground">-6h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

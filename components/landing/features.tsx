"use client"

import { Sparkles, Palette, Layout, Send, Wand2, Smartphone, Instagram, Facebook, Linkedin, Twitter } from "lucide-react"
import { useI18n } from "@/lib/i18n"

const pillarsBase = [
  {
    icon: Sparkles,
    titleKey: "features.block.create",
    tagKey: "features.block.create.tag",
    descriptionKey: "features.subtitle",
    bullets: ["features.bullet.create.1", "features.bullet.create.2", "features.bullet.create.3"],
  },
  {
    icon: Palette,
    titleKey: "features.block.customize",
    tagKey: "features.block.customize.tag",
    descriptionKey: "features.subtitle",
    bullets: ["features.bullet.customize.1", "features.bullet.customize.2", "features.bullet.customize.3"],
  },
  {
    icon: Send,
    titleKey: "features.block.ship",
    tagKey: "features.block.ship.tag",
    descriptionKey: "features.platform.title",
    bullets: ["features.bullet.ship.1", "features.bullet.ship.2", "features.bullet.ship.3"],
  },
]

export function FeaturesSection() {
  const { t } = useI18n()
  const pillars = pillarsBase.map((p) => ({
    ...p,
    title: t(p.titleKey, p.titleKey),
    tag: t(p.tagKey, p.tagKey),
    description: t(p.descriptionKey, p.descriptionKey),
  }))
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("features.title.line1", "Tout le flux créatif,")}
            <span className="block text-gradient">{t("features.title.line2", "du brief à la mise en ligne.")}</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("features.subtitle", "Un studio complet: génération, édition, export multi-réseaux.")}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-lg shadow-primary/5 transition-transform duration-300 hover:-translate-y-1 hover:border-primary/50"
            >
              <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-60" />
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <pillar.icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-secondary/30 px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  {pillar.tag}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
              </div>
              <div className="space-y-2">
                {pillar.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary/80" />
                    <span className="text-muted-foreground">{t(bullet)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid items-center gap-8 rounded-3xl border border-border/60 bg-card/70 px-6 py-6 sm:grid-cols-[1.2fr,1fr] sm:px-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-primary">{t("features.block.ship.tag", "Resize & export")}</p>
            <h3 className="text-2xl font-semibold">{t("features.platform.title", "Safe zones, ratios and text auto-adapted.")}</h3>
            <p className="text-sm text-muted-foreground">
              {t(
                "features.platform.body",
                "One click to adapt your visual for IG, TikTok, LinkedIn and X. We adjust typography, cropping and motion duration to stay readable.",
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
            {[Instagram, Facebook, Linkedin, Twitter, Layout, Smartphone, Wand2].map((Icon, idx) => (
              <div
                key={idx}
                className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/60 bg-card/80 text-foreground/70 transition hover:border-primary/50 hover:text-primary"
              >
                <Icon className="h-6 w-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

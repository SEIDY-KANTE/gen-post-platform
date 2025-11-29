"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useAuth } from "@/lib/hooks/useAuth"

export function CtaBand() {
  const { t } = useI18n()
  const { user } = useAuth()
  const primaryHref = user ? "/dashboard" : "/login"
  return (
    <section className="relative overflow-hidden py-14">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 blur-3xl" aria-hidden />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-4 overflow-hidden rounded-3xl border border-primary/30 bg-card/80 px-6 py-10 text-center shadow-xl shadow-primary/10 sm:px-10">
        <div className="mx-auto flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          {t("cta.badge", "Studio prêt")}
        </div>
        <h3 className="text-2xl font-semibold leading-tight sm:text-3xl">{t("cta.title")}</h3>
        <p className="text-sm text-muted-foreground">{t("cta.subtitle")}</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
          <Link href={primaryHref}>
            <Button size="lg" className="gap-2 rounded-full px-7">
              {t("cta.primary")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/studio/ai">
            <Button variant="ghost" size="lg" className="rounded-full">
              {t("cta.secondary")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

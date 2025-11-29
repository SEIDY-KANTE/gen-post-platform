"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { useAuth } from "@/lib/hooks/useAuth"

const plans = [
  {
    nameKey: "pricing.plan.free.name",
    price: "$0",
    descriptionKey: "pricing.plan.free.desc",
    features: [
      "pricing.features.free.1",
      "pricing.features.free.2",
      "pricing.features.free.3",
      "pricing.features.free.4",
      "pricing.features.free.5",
    ],
    ctaKey: "pricing.plan.free.cta",
    popular: false,
  },
  {
    nameKey: "pricing.plan.premium.name",
    price: "$4.99",
    periodKey: "pricing.period.month",
    descriptionKey: "pricing.plan.premium.desc",
    features: [
      "pricing.features.premium.1",
      "pricing.features.premium.2",
      "pricing.features.premium.3",
      "pricing.features.premium.4",
      "pricing.features.premium.5",
      "pricing.features.premium.6",
    ],
    ctaKey: "pricing.plan.premium.cta",
    popular: true,
  },
  {
    nameKey: "pricing.plan.pro.name",
    price: "$9.99",
    periodKey: "pricing.period.month",
    descriptionKey: "pricing.plan.pro.desc",
    features: [
      "pricing.features.pro.1",
      "pricing.features.pro.2",
      "pricing.features.pro.3",
      "pricing.features.pro.4",
      "pricing.features.pro.5",
      "pricing.features.pro.6",
      "pricing.features.pro.7",
    ],
    ctaKey: "pricing.plan.pro.cta",
    popular: false,
  },
]

export function PricingSection() {
  const { t } = useI18n()
  const { user } = useAuth()
  const planHref = (planKey: string) => {
    const plan = planKey.split(".").pop() || "free"
    if (!user) return "/login"
    if (plan === "free") return "/dashboard"
    return `/credits?plan=${plan}`
  }
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("pricing.title", "Simple, transparent pricing")}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("pricing.subtitle", "Choisissez la vitesse dont vous avez besoin. Annulez à tout moment.")}</p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 text-sm">
          <span className="rounded-full bg-card px-3 py-2 text-muted-foreground">{t("pricing.billing.monthly", "Facturation mensuelle")}</span>
          <span className="rounded-full bg-primary/10 px-3 py-2 text-foreground">{t("pricing.billing.yearly", "-15% annuel (bientôt)")}</span>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.nameKey}
              className={`relative overflow-hidden rounded-3xl border p-8 shadow-lg shadow-primary/5 ${
                plan.popular ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border bg-card/80"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs">
                  {t("pricing.popular", "Popular")}
                </Badge>
              )}
              <div className="text-center">
                <h3 className="text-xl font-semibold">{t(plan.nameKey)}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.periodKey && <span className="text-muted-foreground">{t(plan.periodKey, "/month")}</span>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{t(plan.descriptionKey)}</p>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{t(feature)}</span>
                  </li>
                ))}
              </ul>

              <Link href={planHref(plan.nameKey)} className="mt-8 block">
                <Button className="w-full rounded-full" variant={plan.popular ? "default" : "outline"}>
                  {t(plan.ctaKey)}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 rounded-3xl border border-border/70 bg-card/70 p-6 sm:grid-cols-[1.2fr,1fr] sm:p-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> {t("pricing.packs.badge", "Packs crédits")}
            </div>
            <h3 className="text-2xl font-semibold">{t("pricing.packs.title", "Need a boost? Buy credits on demand.")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("pricing.packs.description", "Perfect for one-off campaigns or testing motion series.")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { labelKey: "pricing.packs.option10", price: "$2", highlight: false },
              { labelKey: "pricing.packs.option20", price: "$3.99", highlight: false },
              { labelKey: "pricing.packs.option50", price: "$5.99", highlight: true },
              { labelKey: "pricing.packs.option100", price: "$12", highlight: true },
            ].map((pack) => (
              <div
                key={pack.labelKey}
                className={`rounded-2xl border px-4 py-4 text-center ${
                  pack.highlight ? "border-primary bg-primary/5" : "border-border/70 bg-card/80"
                }`}
              >
                <p className="font-semibold">{t(pack.labelKey)}</p>
                <p className="text-sm text-muted-foreground">{pack.price}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-4xl flex-col items-center gap-4 rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 px-6 py-10 text-center shadow-lg shadow-primary/10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">{t("pricing.cta.primary", "Ready to launch?")}</p>
          <h3 className="text-2xl font-semibold">{t("pricing.final.title", "We’ll help set up your brand kit and first series.")}</h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={user ? "/dashboard" : "/login"}>
              <Button size="lg" className="gap-2 rounded-full px-7">
                {t("pricing.final.primary", "Start now")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="ghost" size="lg" className="rounded-full">
                {t("pricing.final.secondary", "Talk to the team")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out GenPost",
    features: [
      "5 AI generations / mois",
      "Basic templates",
      "Standard export quality",
      "Watermark discret",
      "Fond presets uniquement",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Premium",
    price: "$4.99",
    period: "/mois",
    description: "For creators who need more",
    features: [
      "60 générations IA / mois",
      "Templates premium + motion",
      "Exports HD PNG / MP4",
      "Pas de watermark",
      "Brand kit (palette & typos)",
      "Support prioritaire",
    ],
    cta: "Start Premium",
    popular: true,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/mois",
    description: "Full creative power",
    features: [
      "150 générations IA / mois",
      "Templates exclusifs + séries",
      "Export 4K + alpha",
      "Handoff équipe & versions",
      "Image & fond générés par IA",
      "Uploads arrière-plan illimité",
      "Support prioritaire",
    ],
    cta: "Start Pro",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground">Choisissez la vitesse dont vous avez besoin. Annulez à tout moment.</p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 text-sm">
          <span className="rounded-full bg-card px-3 py-2 text-muted-foreground">Facturation mensuelle</span>
          <span className="rounded-full bg-primary/10 px-3 py-2 text-foreground">-15% annuel (bientôt)</span>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative overflow-hidden rounded-3xl border p-8 shadow-lg shadow-primary/5 ${
                plan.popular ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border bg-card/80"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs">
                  Populaire
                </Badge>
              )}
              <div className="text-center">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/login" className="mt-8 block">
                <Button className="w-full rounded-full" variant={plan.popular ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 rounded-3xl border border-border/70 bg-card/70 p-6 sm:grid-cols-[1.2fr,1fr] sm:p-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Packs crédits
            </div>
            <h3 className="text-2xl font-semibold">Besoin d&apos;un boost ? Achetez des crédits à la demande.</h3>
            <p className="text-sm text-muted-foreground">Idéal pour les campagnes ponctuelles ou pour tester des séries motion.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "10 crédits", price: "$2", highlight: false },
              { label: "20 crédits", price: "$3.99", highlight: false },
              { label: "50 crédits", price: "$5.99", highlight: true },
              { label: "100 crédits", price: "$12", highlight: true },
            ].map((pack) => (
              <div
                key={pack.label}
                className={`rounded-2xl border px-4 py-4 text-center ${
                  pack.highlight ? "border-primary bg-primary/5" : "border-border/70 bg-card/80"
                }`}
              >
                <p className="font-semibold">{pack.label}</p>
                <p className="text-sm text-muted-foreground">{pack.price}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-4xl flex-col items-center gap-4 rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 px-6 py-10 text-center shadow-lg shadow-primary/10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Prêt à lancer ?</p>
          <h3 className="text-2xl font-semibold">On vous aide à configurer votre brand kit et votre première série.</h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="gap-2 rounded-full px-7">
                Démarrer maintenant <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="lg" className="rounded-full">
              Parler à l&apos;équipe
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

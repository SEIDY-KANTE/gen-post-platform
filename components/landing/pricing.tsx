"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out GenPost",
    features: ["5 AI generations", "Basic templates", "Standard export quality", "Watermark on exports"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For creators and small teams",
    features: [
      "100 AI generations/month",
      "All premium templates",
      "High-quality exports",
      "No watermark",
      "Priority support",
      "Custom fonts",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "/month",
    description: "For agencies and large teams",
    features: [
      "Unlimited AI generations",
      "All templates + exclusive",
      "4K export quality",
      "API access",
      "Team collaboration",
      "Custom branding",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground">Start free, upgrade when you need more power.</p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.popular ? "border-primary bg-primary/5 shadow-xl" : "border-border bg-card"
              }`}
            >
              {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}
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
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Credit packs */}
        <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-border bg-card p-8 text-center">
          <h3 className="text-xl font-semibold">Need more credits?</h3>
          <p className="mt-2 text-muted-foreground">Buy credit packs anytime without a subscription</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="rounded-lg border border-border px-4 py-3">
              <p className="font-semibold">10 credits</p>
              <p className="text-sm text-muted-foreground">$5</p>
            </div>
            <div className="rounded-lg border border-border px-4 py-3">
              <p className="font-semibold">50 credits</p>
              <p className="text-sm text-muted-foreground">$20</p>
            </div>
            <div className="rounded-lg border border-primary bg-primary/5 px-4 py-3">
              <p className="font-semibold">100 credits</p>
              <p className="text-sm text-muted-foreground">$35</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

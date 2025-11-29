"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { STRIPE_PRODUCTS, formatPrice } from "@/lib/stripe/client-config"
import { Loader2, Check, Zap, Crown, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n"

export default function CreditsPage() {
  const { user } = useAppStore()
  const [loading, setLoading] = useState<string | null>(null)
  const { t } = useI18n()

  const handlePurchase = async (productId: string) => {
    setLoading(productId)

    try {
      const response = await fetch("/api/payment/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout")
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Purchase error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to start checkout"
      toast.error(errorMessage)
      setLoading(null)
    }
  }

  const creditPackages = [
    {
      id: "credits_10",
      ...STRIPE_PRODUCTS.credits_10,
      icon: Sparkles,
      popular: false,
      bestValue: false,
    },
    {
      id: "credits_20",
      ...STRIPE_PRODUCTS.credits_20,
      icon: Sparkles,
      popular: true,
      bestValue: false,
    },
    {
      id: "credits_50",
      ...STRIPE_PRODUCTS.credits_50,
      icon: Zap,
      popular: false,
      bestValue: true,
    },
    {
      id: "credits_100",
      ...STRIPE_PRODUCTS.credits_100,
      icon: Crown,
      popular: false,
      bestValue: false,
    },
  ]

  const subscriptionPlans = [
    {
      id: "free",
      name: "Free",
      description: "Free plan",
      credits: 0,
      price: 0,
      recurring: "month" as const,
      priceId: "",
      icon: Sparkles,
      features: [
        "5 AI generations",
        "Basic templates",
        "Standard export quality",
        "Preset backgrounds only",
      ],
      currentPlan: user?.plan === "free",
      popular: false,
    },
    {
      id: "premium",
      ...STRIPE_PRODUCTS.premium,
      icon: Zap,
      features: [
        "All free features",
        "60 AI generations/month",
        "All premium templates",
        "High-quality exports",
        "Custom backgrounds",
      ],
      currentPlan: user?.plan === "premium",
      popular: true,
    },
    {
      id: "pro",
      ...STRIPE_PRODUCTS.pro,
      icon: Crown,
      features: [
        "150 AI generations/month",
        "All templates + exclusive",
        "4K export quality",
        "Custom backgrounds",
        "AI image generation",
        "Background image upload",
        "Priority support",
      ],
      currentPlan: user?.plan === "pro",
      popular: false,
    },
  ]

  const getPlanCreditsMax = (plan: string) => {
    switch (plan) {
      case "pro":
        return 150
      case "premium":
        return 60
      default:
        return 10
    }
  }

  const creditsMax = getPlanCreditsMax(user?.plan || "free")
  const creditsPercent = creditsMax ? Math.min(100, ((user?.credits || 0) / creditsMax) * 100) : 0

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title={t("credits.title", "Credits & Plans")}
        description={t("credits.desc", "Purchase credits or upgrade to a subscription plan")}
      />

      <div className="p-4 space-y-8 max-w-6xl mx-auto md:p-6">
        {/* Current Credits */}
        <Card className="overflow-hidden border-border/70 bg-card/80 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{t("credits.current", "Your credits")}</h3>
              <p className="text-sm text-muted-foreground">
                {user?.credits || 0} {t("credits.remaining", "remaining • Plan")} {user?.plan || "free"}
              </p>
              <div className="mt-2 h-2 w-full max-w-md overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${creditsPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{t("credits.tip", "Recharge before you hit 0 to avoid interruptions.")}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl font-bold text-primary">
                  {user?.credits || 0}
                </span>
              </div>
              <div className="hidden sm:flex flex-col gap-2">
                <Button size="sm" className="rounded-full" onClick={() => handlePurchase("credits_20")}>
                  {t("credits.cta.buy", "Buy credits")}
                </Button>
                <Button size="sm" variant="ghost" className="rounded-full" onClick={() => handlePurchase("pro")}>
                  {t("credits.cta.upgrade", "Upgrade to Pro")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Packages */}
        <div>
          <h2 className="mb-4 text-2xl font-bold">{t("credits.oneTime", "One-Time Credit Packs")}</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {creditPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={pkg.popular ? "border-primary shadow-lg" : ""}
              >
                {pkg.popular && (
                  <div className="flex justify-center">
                    <Badge className="rounded-b-md rounded-t-none">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {pkg.bestValue && (
                  <div className="flex justify-center">
                    <Badge className="rounded-b-md rounded-t-none bg-green-500 text-white">
                      {t("credits.bestValue", "Best Value")}
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <pkg.icon className="h-8 w-8 text-primary" />
                    <span className="text-3xl font-bold">
                      {formatPrice(pkg.price)}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{pkg.credits}</span>
                    <span className="text-muted-foreground">credits</span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={loading === pkg.id}
                  >
                    {loading === pkg.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Purchase"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Subscription Plans */}
        <div>
          <h2 className="mb-4 text-2xl font-bold">{t("credits.subscriptions", "Subscription Plans")}</h2>
          <p className="mb-6 text-muted-foreground">
            {t("credits.desc", "Get credits every month with our subscription plans")}
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id}
                className={plan.popular ? "border-primary border-2 mb-4 -mt-4 shadow-xl" : ""}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <plan.icon className="h-10 w-10 text-primary" />
                    {plan.id === "pro" && (
                      <Badge variant="secondary">
                        <Crown className="mr-1 h-3 w-3" />
                        Best Value
                      </Badge>
                    )}
                    {plan.currentPlan && (
                      <Badge variant="secondary">
                        Current Plan
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="flex items-baseline gap-1 pt-4">
                    <span className="text-4xl font-bold">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.id === "pro" ? "default" : "outline"}
                    onClick={() => handlePurchase(plan.id)}
                    disabled={loading === plan.id || user?.plan === plan.id}
                  >
                    {loading === plan.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : user?.plan === plan.id ? (
                      "Current Plan"
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

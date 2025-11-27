"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { Coins, Check, Zap, Building2, Sparkles, TrendingUp, Calendar } from "lucide-react"

const creditPacks = [
  { id: "pack-10", credits: 10, price: 5, pricePerCredit: 0.5 },
  { id: "pack-50", credits: 50, price: 20, pricePerCredit: 0.4, popular: true },
  { id: "pack-100", credits: 100, price: 35, pricePerCredit: 0.35, bestValue: true },
  { id: "pack-250", credits: 250, price: 75, pricePerCredit: 0.3 },
]

const subscriptionPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    credits: 5,
    period: "one-time",
    icon: Sparkles,
    features: ["5 AI generations", "Basic templates", "Standard export quality", "Watermark on exports"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 12,
    credits: 100,
    period: "month",
    icon: Zap,
    popular: true,
    features: [
      "100 AI generations/month",
      "All premium templates",
      "High-quality exports",
      "No watermark",
      "Priority support",
      "Custom fonts",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 49,
    credits: -1, // unlimited
    period: "month",
    icon: Building2,
    features: [
      "Unlimited AI generations",
      "All templates + exclusive",
      "4K export quality",
      "API access",
      "Team collaboration",
      "Custom branding",
      "Dedicated support",
    ],
  },
]

export default function CreditsPage() {
  const { user, addCredits } = useAppStore()
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const handleBuyCredits = async (packId: string, credits: number) => {
    setIsProcessing(packId)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500))
    addCredits(credits)
    setIsProcessing(null)
    toast.success(`Successfully added ${credits} credits!`)
  }

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(planId)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    // In production, this would redirect to Stripe checkout
    setIsProcessing(null)
    toast.success("Subscription feature coming soon!")
  }

  const usagePercentage = user ? Math.min(((5 - user.credits) / 5) * 100, 100) : 0

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Credits & Subscription" description="Manage your credits and subscription plan" />

      <div className="p-6 space-y-8 max-w-6xl mx-auto">
        {/* Current Credits */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Coins className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Credits</p>
                  <p className="text-4xl font-bold">{user?.credits || 0}</p>
                </div>
              </div>
              <div className="flex-1 max-w-xs">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Usage this month</span>
                  <span className="font-medium">{5 - (user?.credits || 0)} / 5 used</span>
                </div>
                <Progress value={usagePercentage} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Packs */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Buy Credit Packs</h2>
            <p className="text-muted-foreground">One-time purchase, no subscription required</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {creditPacks.map((pack) => (
              <Card
                key={pack.id}
                className={`relative transition-all hover:border-primary ${
                  pack.popular ? "border-primary" : ""
                } ${pack.bestValue ? "ring-2 ring-primary" : ""}`}
              >
                {pack.popular && <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">Popular</Badge>}
                {pack.bestValue && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-accent">Best Value</Badge>
                )}
                <CardContent className="p-6 text-center">
                  <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-primary/10">
                    <Coins className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mt-4 text-3xl font-bold">{pack.credits}</p>
                  <p className="text-sm text-muted-foreground">credits</p>
                  <p className="mt-4 text-2xl font-semibold">${pack.price}</p>
                  <p className="text-xs text-muted-foreground">${pack.pricePerCredit.toFixed(2)} per credit</p>
                  <Button
                    className="mt-6 w-full"
                    onClick={() => handleBuyCredits(pack.id, pack.credits)}
                    disabled={isProcessing === pack.id}
                  >
                    {isProcessing === pack.id ? "Processing..." : "Buy Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Subscription Plans */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Subscription Plans</h2>
            <p className="text-muted-foreground">Get more credits every month with a subscription</p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {subscriptionPlans.map((plan) => {
              const isCurrentPlan = user?.plan === plan.id
              return (
                <Card
                  key={plan.id}
                  className={`relative ${
                    plan.popular ? "border-primary shadow-lg" : ""
                  } ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
                >
                  {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}
                  {isCurrentPlan && (
                    <Badge variant="secondary" className="absolute -top-3 right-4">
                      Current Plan
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <plan.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="mt-4">{plan.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                      {plan.period !== "one-time" && <span className="text-muted-foreground">/{plan.period}</span>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-muted p-3">
                      <Coins className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        {plan.credits === -1 ? "Unlimited" : plan.credits} credits
                        {plan.period !== "one-time" && "/month"}
                      </span>
                    </div>

                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? "outline" : "default"}
                      disabled={isCurrentPlan || isProcessing === plan.id}
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {isCurrentPlan
                        ? "Current Plan"
                        : isProcessing === plan.id
                          ? "Processing..."
                          : plan.id === "free"
                            ? "Get Started"
                            : "Subscribe"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Usage History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Usage
            </CardTitle>
            <CardDescription>Your credit usage history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No usage history yet</p>
              <p className="text-sm">Your AI generation history will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

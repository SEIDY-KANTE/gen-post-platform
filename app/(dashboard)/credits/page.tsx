"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"
import { Coins, Check, Zap, Sparkles, TrendingUp, Calendar, Crown } from "lucide-react"

const creditPacks = [
  { id: "pack-10", credits: 10, price: 2, pricePerCredit: 0.2000 },
  { id: "pack-20", credits: 20, price: 3.99, pricePerCredit: 0.1995, popular: true },
  { id: "pack-50", credits: 50, price: 5.99, pricePerCredit: 0.1198, bestValue: true },
  { id: "pack-100", credits: 100, price: 12, pricePerCredit: 0.1200 },
]

const subscriptionPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    credits: 5,
    period: "one-time",
    icon: Sparkles,
    features: [
      "5 AI generations",
      "Basic templates",
      "Standard export quality",
      "No watermark",
      "Preset backgrounds only",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 4.99,
    credits: 60,
    period: "month",
    icon: Zap,
    popular: true,
    features: [
      "60 AI generations/month",
      "All premium templates",
      "High-quality exports",
      "No watermark",
      "Custom backgrounds",
      "Priority support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    credits: 150,
    period: "month",
    icon: Crown,
    features: [
      "150 AI generations/month",
      "All templates + exclusive",
      "4K export quality",
      "No watermark",
      "Custom backgrounds",
      "AI image generation",
      "Background image upload",
      "Priority support",
    ],
  },
]

export default function CreditsPage() {
  const router = useRouter()
  const { user } = useAppStore()
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const handleBuyCredits = async (packId: string, credits: number, price: number) => {
    setIsProcessing(packId)
    // Redirect to payment page with pack info
    router.push(`/payment?type=credits&pack=${packId}&credits=${credits}&price=${price}`)
  }

  const handleSubscribe = async (planId: string, price: number, planName: string) => {
    if (planId === "free") return
    setIsProcessing(planId)
    // Redirect to payment page with subscription info
    router.push(`/payment?type=subscription&plan=${planId}&price=${price}&name=${planName}`)
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
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-secondary text-primary">Best Value</Badge>
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
                    onClick={() => handleBuyCredits(pack.id, pack.credits, pack.price)}
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
                        {plan.credits} credits
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
                      onClick={() => handleSubscribe(plan.id, plan.price, plan.name)}
                    >
                      {isCurrentPlan
                        ? "Current Plan"
                        : isProcessing === plan.id
                          ? "Processing..."
                          : plan.id === "free"
                            ? "Current Plan"
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

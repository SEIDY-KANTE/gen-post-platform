"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAppStore } from "@/lib/store"
import { CreditCard, Lock, ArrowLeft, Loader2, CheckCircle2, Coins, Crown } from "lucide-react"
import Link from "next/link"

function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addCredits, updatePlan } = useAppStore()

  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [name, setName] = useState("")

  const type = searchParams.get("type") // 'credits' or 'subscription'
  const pack = searchParams.get("pack")
  const credits = searchParams.get("credits")
  const price = searchParams.get("price")
  const plan = searchParams.get("plan")
  const planName = searchParams.get("name")

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(" ") : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate Stripe payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock successful payment
    if (type === "credits" && credits) {
      addCredits(Number.parseInt(credits))
    } else if (type === "subscription" && plan) {
      const planCredits = plan === "premium" ? 50 : plan === "pro" ? 150 : 0
      updatePlan(plan as "free" | "premium" | "pro", planCredits)
    }

    setIsProcessing(false)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold">Payment Successful!</h2>
              <p className="text-muted-foreground">
                {type === "credits"
                  ? `${credits} credits have been added to your account.`
                  : `You are now subscribed to the ${planName} plan.`}
              </p>
              <div className="pt-4 space-y-2">
                <Button className="w-full" onClick={() => router.push("/dashboard")}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/studio/ai")}>
                  Start Creating
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Link href="/credits" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            Secure Payment
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl py-10 px-4">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>{type === "credits" ? "Credit Pack Purchase" : "Subscription Plan"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  {type === "credits" ? (
                    <Coins className="h-6 w-6 text-primary" />
                  ) : (
                    <Crown className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{type === "credits" ? `${credits} Credits Pack` : `${planName} Plan`}</p>
                  <p className="text-sm text-muted-foreground">
                    {type === "credits" ? "One-time purchase" : "Monthly subscription"}
                  </p>
                </div>
                <p className="text-xl font-bold">${price}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${price}</span>
                </div>
              </div>

              {type === "subscription" && (
                <p className="text-xs text-muted-foreground">
                  You will be charged ${price}/month. Cancel anytime from your account settings.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
              <CardDescription>Enter your card information to complete the purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name on Card</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      maxLength={3}
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay $${price}`
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                  <Lock className="h-3 w-3" />
                  <span>Payments are secure and encrypted</span>
                </div>

                {/* Test card info */}
                <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Test Mode</p>
                  <p>Use card number: 4242 4242 4242 4242</p>
                  <p>Any future expiry date and any 3-digit CVC</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  )
}

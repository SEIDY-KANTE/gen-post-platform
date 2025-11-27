"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { Coins } from "lucide-react"
import Link from "next/link"

interface CreditsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const creditPacks = [
  { credits: 10, price: "$5", popular: false },
  { credits: 50, price: "$20", popular: true },
  { credits: 100, price: "$35", popular: false },
]

export function CreditsModal({ open, onOpenChange }: CreditsModalProps) {
  const { addCredits } = useAppStore()

  const handleBuy = (credits: number) => {
    // In production, this would trigger a payment flow
    addCredits(credits)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Out of Credits
          </DialogTitle>
          <DialogDescription>You need credits to use AI generation. Buy more to continue creating.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {creditPacks.map((pack) => (
            <button
              key={pack.credits}
              onClick={() => handleBuy(pack.credits)}
              className={`flex w-full items-center justify-between rounded-lg border p-4 transition-all hover:border-primary ${
                pack.popular ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Coins className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">{pack.credits} Credits</p>
                  {pack.popular && <p className="text-xs text-primary">Best Value</p>}
                </div>
              </div>
              <span className="text-lg font-bold">{pack.price}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-border pt-4">
          <Link href="/credits" className="block">
            <Button variant="outline" className="w-full bg-transparent">
              View All Plans
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}

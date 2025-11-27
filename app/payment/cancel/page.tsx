"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function PaymentCancelPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <XCircle className="h-10 w-10 text-muted-foreground" />
                    </div>

                    <h1 className="mt-6 text-2xl font-bold">Payment Cancelled</h1>
                    <p className="mt-2 text-muted-foreground">
                        Your payment was cancelled. No charges were made.
                    </p>

                    <div className="mt-8 flex gap-3">
                        <Link href="/credits">
                            <Button>Try Again</Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="outline">Go to Dashboard</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

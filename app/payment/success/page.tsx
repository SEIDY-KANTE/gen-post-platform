"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Sparkles } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useAuth } from "@/lib/hooks/useAuth"

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { user } = useAuth()
    const { fetchUser } = useAppStore()
    const [loading, setLoading] = useState(true)

    const sessionId = searchParams.get("session_id")

    useEffect(() => {
        // Refresh user data to get updated credits
        if (user?.id) {
            fetchUser(user.id).finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [user?.id, fetchUser])

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>

                    <h1 className="mt-6 text-2xl font-bold">Payment Successful!</h1>
                    <p className="mt-2 text-muted-foreground">
                        Your credits have been added to your account.
                    </p>

                    {!loading && (
                        <div className="mt-6 flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-3">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <span className="font-medium">
                                Start creating amazing posts now!
                            </span>
                        </div>
                    )}

                    <div className="mt-8 flex gap-3">
                        <Link href="/studio/ai">
                            <Button>Create Post</Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="outline">Go to Dashboard</Button>
                        </Link>
                    </div>

                    {sessionId && (
                        <p className="mt-6 text-xs text-muted-foreground">
                            Session ID: {sessionId}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

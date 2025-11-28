"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAppStore } from "@/lib/store"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
    const router = useRouter()
    const { fetchUser } = useAppStore()

    useEffect(() => {
        const handleCallback = async () => {
            const supabase = createClient()

            // Get the session from the URL hash
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession()

            if (error) {
                console.error("Error getting session:", error)
                router.push("/login?error=auth_callback_error")
                return
            }

            if (session?.user) {
                // Fetch or create user profile
                await fetchUser(session.user.id)

                // Redirect to dashboard
                router.push("/dashboard")
            } else {
                router.push("/login")
            }
        }

        handleCallback()
    }, [router, fetchUser])

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Signing you in...</p>
            </div>
        </div>
    )
}

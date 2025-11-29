"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { useAppStore } from "@/lib/store"
import { useAuth } from "@/lib/hooks/useAuth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, fetchUser } = useAppStore()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Wait for client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize user data on mount if authenticated
  useEffect(() => {
    if (user?.id && !isAuthenticated) {
      fetchUser(user.id)
    }
  }, [user?.id, isAuthenticated, fetchUser])

  // Only redirect to login if we're sure user is not authenticated
  // Wait for auth state to be loaded before redirecting
  useEffect(() => {
    if (!loading && !user && mounted) {
      router.push("/login")
    }
  }, [loading, user, mounted, router])

  // Show nothing while loading or not mounted
  if (!mounted || loading) {
    return null
  }

  // Don't render if no user after loading
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileNav />
      <main className="pl-0 transition-all duration-300 md:pl-64">{children}</main>
    </div>
  )
}

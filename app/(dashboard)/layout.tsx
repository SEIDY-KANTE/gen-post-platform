"use client"

import type React from "react"

import { useEffect } from "react"
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
  const { user } = useAuth()

  // Initialize user data on mount if authenticated
  useEffect(() => {
    if (user?.id && !isAuthenticated) {
      fetchUser(user.id)
    }
  }, [user?.id, isAuthenticated, fetchUser])

  useEffect(() => {
    if (!isAuthenticated && !user) {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated && !user) {
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

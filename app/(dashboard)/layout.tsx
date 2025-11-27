"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
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
      <main className="pl-64 transition-all duration-300">{children}</main>
    </div>
  )
}

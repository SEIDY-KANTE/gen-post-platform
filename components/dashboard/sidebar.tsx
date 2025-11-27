"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import {
  Sparkles,
  LayoutDashboard,
  Wand2,
  Palette,
  Layout,
  CreditCard,
  History,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Coins,
} from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Generator", href: "/studio/ai", icon: Wand2 },
  { name: "Manual Editor", href: "/studio/manual", icon: Palette },
  { name: "Templates", href: "/templates", icon: Layout },
  { name: "History", href: "/history", icon: History },
  { name: "Credits", href: "/credits", icon: CreditCard },
  { name: "Profile", href: "/profile", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAppStore()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">GenPost</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-8 w-8", collapsed && "absolute -right-4 top-4 rounded-full border bg-card")}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Credits indicator */}
      {user && (
        <div className={cn("border-t border-border p-3", collapsed && "px-2")}>
          <div
            className={cn("flex items-center gap-3 rounded-lg bg-primary/10 p-3", collapsed && "justify-center p-2")}
          >
            <Coins className="h-5 w-5 text-primary" />
            {!collapsed && (
              <div>
                <p className="text-xs text-muted-foreground">Credits</p>
                <p className="font-semibold">{user.credits}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User section */}
      <div className={cn("border-t border-border p-3", collapsed && "px-2")}>
        {user && (
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={() => logout()} className={cn("h-8 w-8", collapsed && "ml-0")}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}

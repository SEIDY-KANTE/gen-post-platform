"use client"

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Sparkles, Coins, User, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import {
    LayoutDashboard,
    Wand2,
    Palette,
    Layout as LayoutIcon,
    History as HistoryIcon,
    CreditCard,
    User as UserIcon,
    MessageSquare,
} from "lucide-react"
import { useState } from "react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Generator", href: "/studio/ai", icon: Wand2 },
    { name: "Manual Editor", href: "/studio/manual", icon: Palette },
    { name: "Templates", href: "/templates", icon: LayoutIcon },
    { name: "History", href: "/history", icon: HistoryIcon },
    { name: "Credits", href: "/credits", icon: CreditCard },
    { name: "Profile", href: "/profile", icon: UserIcon },
    { name: "Support", href: "/support", icon: MessageSquare },
]

export function MobileNav() {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout } = useAppStore()
    const [open, setOpen] = useState(false)

    const handleLogout = async () => {
        try {
            await logout()
            router.push("/login")
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    return (
        <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card px-4 md:hidden">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold">GenPost</span>
            </Link>

            {/* Credits Display */}
            {user && (
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5">
                    <Coins className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">{user.credits}</span>
                </div>
            )}

            {/* Hamburger Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 p-0">
                    <VisuallyHidden>
                        <SheetTitle>Navigation Menu</SheetTitle>
                    </VisuallyHidden>
                    <div className="flex h-full flex-col">
                        {/* Logo in drawer */}
                        <div className="flex h-16 items-center border-b border-border px-4">
                            <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                                </div>
                                <span className="font-bold">GenPost</span>
                            </Link>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 space-y-1 p-3">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5 shrink-0" />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Credits Section */}
                        {user && (
                            <div className="border-t border-border p-3">
                                <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-3">
                                    <Coins className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Credits</p>
                                        <p className="font-semibold">{user.credits}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* User Section */}
                        <div className="border-t border-border p-3">
                            {user && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                                            <User className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="truncate text-sm font-medium">{user.name}</p>
                                            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleLogout}
                                        className="w-full justify-start gap-2"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Bell, Sparkles } from "lucide-react"
import { useAppStore } from "@/lib/store"
import type { ReactNode } from "react"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { useI18n } from "@/lib/i18n"

interface DashboardHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export function DashboardHeader({ title, description, action }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme()
  const { user } = useAppStore()
  const { t } = useI18n()

  return (
    <header className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 px-5 py-4 shadow-sm shadow-primary/5 sm:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklch,var(--primary)_20%,transparent),transparent_40%),radial-gradient(circle_at_80%_0%,color-mix(in_oklch,var(--accent)_22%,transparent),transparent_38%)] blur-3xl" />
      </div>
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {t("nav.features", "Creator space")}
          </div>
          <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {action}
          {user && (
            <div className="hidden items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3 py-1.5 text-xs font-semibold text-foreground/80 sm:flex">
              <span className="rounded-full bg-primary/15 px-2 py-1 text-[11px] uppercase tracking-wide text-primary">
                {t("credits.current", "Credits")}
              </span>
              <span>{user.credits}</span>
            </div>
          )}
          <LocaleSwitcher condensed />
          <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={t("nav.toggleTheme", "Toggle theme")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </div>
    </header>
  )
}

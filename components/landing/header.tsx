"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun, Sparkles, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { useI18n } from "@/lib/i18n"
import { LocaleSwitcher } from "@/components/locale-switcher"

export function LandingHeader() {
  const { theme, setTheme } = useTheme()
  const { user, loading } = useAuth()
  const router = useRouter()
  const { t } = useI18n()

  // Redirect logged-in users to dashboard
  // useEffect(() => {
  //   if (!loading && user) {
  //     router.push("/dashboard")
  //   }
  // }, [loading, user, router])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl">
      <div className="hidden items-center justify-center border-b border-border/40 bg-gradient-to-r from-primary/10 via-transparent to-accent/15 px-4 py-2 text-xs font-medium text-muted-foreground sm:flex">
        <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-foreground/90 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {t("trust.annonce", "Nouvelles templates motion prêtes pour Instagram et TikTok")}
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="mx-auto mt-2 flex h-16 max-w-7xl items-center justify-between rounded-full border border-border/60 bg-card/80 px-4 shadow-lg shadow-primary/5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/90">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">GenPost Studio</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {[
            { href: "#features", label: t("nav.features", "Fonctionnalités") },
            { href: "#templates", label: t("nav.templates", "Templates") },
            { href: "#pricing", label: t("nav.pricing", "Tarifs") },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-primary/10 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher condensed />
          <div className="hidden items-center gap-1 rounded-full border border-border px-1 py-1 text-xs font-medium md:flex">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <span className="hidden px-2 text-muted-foreground sm:inline">Auto</span>
          </div>

          {!loading && (
            <>
              {user ? (
                <Link href="/dashboard">
                  <Button size="sm" className="rounded-full">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="rounded-full">
                      {t("nav.signin", "Connexion")}
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="sm" className="rounded-full">
                      {t("nav.getStarted", "Commencer")}
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}

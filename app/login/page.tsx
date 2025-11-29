"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Script from "next/script"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Mail, Lock, User } from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n"


// Turnstile Widget Component to handle dynamic rendering
function TurnstileWidget({ onVerify }: { onVerify: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [widgetId, setWidgetId] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return

    // Function to render widget
    const renderWidget = () => {
      if ((window as any).turnstile && containerRef.current && !widgetId) {
        try {
          // Clear container first just in case
          containerRef.current.innerHTML = ''

          const id = (window as any).turnstile.render(containerRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
            theme: 'light',
            callback: (token: string) => onVerify(token),
          })
          setWidgetId(id)
        } catch (e) {
          console.error('Turnstile render error:', e)
        }
      } else if (!(window as any).turnstile) {
        // Retry if script not loaded yet
        setTimeout(renderWidget, 100)
      }
    }

    renderWidget()

    return () => {
      // Cleanup if needed
      if (widgetId && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(widgetId)
        } catch (e) {
          // Ignore removal errors
        }
      }
    }
  }, [])

  return <div ref={containerRef} className="flex justify-center min-h-[65px]" />
}

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const { fetchUser } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string>("")
  const { t } = useI18n()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const { user } = await signIn(email, password)

      // Fetch user data from database to update store
      if (user) {
        await fetchUser(user.id)
      }

      toast.success(t("auth.success.login", "Welcome back!"))
      router.push("/dashboard")
    } catch (error: unknown) {
      console.error('Login error:', error)

      // Better error messages
      let errorMessage = t("auth.errors.loginFailed", "Login failed. Please try again.")

      if (error instanceof Error) {
        // Handle common Supabase auth errors
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = t("auth.errors.invalidCreds", "Invalid email or password. Please check and try again.")
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = t("auth.errors.emailConfirm", "Please confirm your email before logging in.")
        } else if (error.message.includes("User not found")) {
          errorMessage = t("auth.errors.userNotFound", "No account found with this email.")
        } else {
          errorMessage = error.message
        }
      }

      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }


  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      // Check Turnstile if configured
      if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
        if (!turnstileToken) {
          toast.error(t("auth.turnstile", "Please complete the security verification"))
          setIsLoading(false)
          return
        }
      }

      const { user } = await signUp(email, password, name, turnstileToken)

      // Fetch user data from database to update store
      if (user) {
        await fetchUser(user.id)
      }

      toast.success(t("auth.success.signup", "Account created! You received 5 free credits."))
      router.push("/dashboard")
    } catch (error: unknown) {
      console.error('Signup error:', error)

      // Better error messages
      let errorMessage = t("auth.errors.signupFailed", "Signup failed. Please try again.")

      if (error instanceof Error) {
        // Handle common Supabase auth errors
        if (error.message.includes("User already registered")) {
          errorMessage = t("auth.errors.emailRegistered", "This email is already registered. Please sign in instead.")
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = t("auth.errors.passwordWeak", "Password must be at least 6 characters long.")
        } else if (error.message.includes("Invalid email")) {
          errorMessage = t("auth.errors.invalidEmail", "Please enter a valid email address.")
        } else {
          errorMessage = error.message
        }
      }

      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }


  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      await signInWithGoogle()
      // The redirect happens automatically, no need to manually navigate
    } catch (error: unknown) {
      console.error('Google sign-in error:', error)
      toast.error(error instanceof Error ? error.message : t("auth.errors.loginFailed", "Failed to sign in with Google"))
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold">GenPost</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("auth.welcome", "Welcome to GenPost")}</CardTitle>
          <CardDescription>{t("auth.subtitle", "Create stunning social media posts with AI")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t("auth.signin", "Sign In")}</TabsTrigger>
              <TabsTrigger value="signup">{t("auth.signup", "Sign Up")}</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{t("auth.email", "Email")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">{t("auth.password", "Password")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t("auth.signingIn", "Signing in...") : t("auth.signin", "Sign In")}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">{t("auth.or", "Or continue with")}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isLoading}
                >
                  {isGoogleLoading ? (
                    t("auth.connecting", "Connecting...")
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      {t("auth.google", "Continue with Google")}
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">{t("auth.name", "Full Name")}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="signup-name" name="name" type="text" placeholder="John Doe" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">{t("auth.email", "Email")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">{t("auth.password", "Password")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Cloudflare Turnstile - only show if configured */}
                {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                  <TurnstileWidget onVerify={setTurnstileToken} />
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t("auth.creatingAccount", "Creating account...") : t("auth.createAccount", "Create account")}
                </Button>
                <p className="text-center text-xs text-muted-foreground">{t("auth.bonus", "Get 5 free AI credits when you sign up!")}</p>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">{t("auth.or", "Or continue with")}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isLoading}
                >
                  {isGoogleLoading ? (
                    t("auth.connecting", "Connecting...")
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      {t("auth.google", "Continue with Google")}
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <p className="mt-6 text-sm text-muted-foreground">
        {t("auth.terms", "By continuing, you agree to our")}{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          {t("footer.terms", "Terms")}
        </Link>{" "}
        {t("footer.and", "and")}{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          {t("footer.privacy", "Privacy Policy")}
        </Link>
      </p>

      {/* Load Cloudflare Turnstile Script */}
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
    </div>
  )
}

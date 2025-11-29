"use client"

import { useEffect } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { useAuth } from "@/lib/hooks/useAuth"
import { templates } from "@/lib/templates"
import { useI18n } from "@/lib/i18n"
import {
  Wand2,
  Palette,
  Layout,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Coins,
  Clock3,
  ShieldCheck,
  Star,
  CheckCircle2,
  Flame,
  PlaySquare,
} from "lucide-react"

export default function DashboardPage() {
  const { user: authUser } = useAuth()
  const { user, posts, fetchUser, fetchPosts } = useAppStore()
  const { t } = useI18n()

  // Fetch user data and posts on mount
  useEffect(() => {
    if (authUser?.id && !user) {
      fetchUser(authUser.id)
    }
    if (authUser?.id) {
      fetchPosts(authUser.id)
    }
  }, [authUser?.id, user, fetchUser, fetchPosts])

  // Calculate unique templates used
  const uniqueTemplates = new Set(posts.map(p => p.template)).size

  const stats = [
    { label: t("home.stats.posts", "Posts created"), value: posts.length, icon: TrendingUp, hint: "" },
    { label: t("home.stats.credits", "Credits left"), value: user?.credits || 0, icon: Coins, hint: t("home.cta.lowCredits", "Credits running low") },
    { label: t("home.stats.templates", "Templates used"), value: uniqueTemplates, icon: Layout, hint: t("home.templates.title", "Favorite templates") },
    { label: t("home.stats.timeSaved", "Time saved"), value: "6h", icon: Clock3, hint: t("home.stats.hintManual", "vs manual design") },
  ]

  const quickActions = [
    {
      title: t("studio.ai.headerTitle", "AI Generator"),
      description: t("home.quickActions", "Brief 1 phrase, automatic variations."),
      icon: Wand2,
      href: "/studio/ai",
      color: "from-primary/15 via-primary/10 to-accent/10",
      badge: t("templates.mode.ai", "AI Mode"),
    },
    {
      title: t("studio.manual.headerTitle", "Manual Editor"),
      description: t("home.quickActions", "Full control, grids and locked layers."),
      icon: Palette,
      href: "/studio/manual",
      color: "from-accent/15 via-card to-primary/10",
      badge: t("templates.mode.manual", "Manual"),
    },
    {
      title: t("templates.title", "Templates"),
      description: t("templates.description", "Motion series & carousels ready to post."),
      icon: Layout,
      href: "/templates",
      color: "from-orange-400/15 via-primary/5 to-accent/10",
      badge: t("templatesPreview.note", "New"),
    },
  ]

  const featuredTemplates = templates.slice(0, 8)
  const premiumTemplates = templates.filter((t) => t.isPremium).slice(0, 6)

  const activity = [
    { label: t("home.activity.item1", "Brand kit applied"), time: t("home.activity.time2h", "2h ago"), status: t("home.activity.statusSuccess", "Success") },
    { label: t("home.activity.item2", "MP4 export (Reel)"), time: t("home.activity.time4h", "4h ago"), status: t("home.activity.statusDone", "Done") },
    { label: t("home.activity.item3", "AI generation (quote)"), time: t("home.activity.timeYesterday", "Yesterday"), status: t("home.activity.statusOk", "OK") },
  ]

  const checklist = [
    t("home.checklist.item1", "Set safe zones IG/LinkedIn"),
    t("home.checklist.item2", "Enable favorite motion templates"),
    t("home.checklist.item3", "Upload your fonts and logos"),
  ]

  const getTemplateForPost = (post: typeof posts[0]) => {
    return templates.find((t) => t.id === post.template) || templates[0]
  }

  const getPostBackground = (post: typeof posts[0]) => {
    if (post.gradient) return post.gradient
    if (post.backgroundColor) return post.backgroundColor
    const template = getTemplateForPost(post)
    return template.gradient || template.backgroundColor || "#667eea"
  }

  return (
    <div className="min-h-screen space-y-6">
      <DashboardHeader
        title={`${t("home.welcome", "Welcome back")} ${user?.name || "creator"} 👋`}
        description={t("home.subtitle", "One space to generate, animate and publish your posts.")}
        action={
          <Link href="/templates">
            <Button size="sm" className="rounded-full">
              {t("templates.title", "Templates")}
            </Button>
          </Link>
        }
      />

      <div className="space-y-6 px-4 pb-12 md:px-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr,0.7fr]">
          <Card className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-lg shadow-primary/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklch,var(--primary)_20%,transparent),transparent_35%),radial-gradient(circle_at_80%_0%,color-mix(in_oklch,var(--accent)_24%,transparent),transparent_40%)] opacity-70 blur-2xl" />
            <CardContent className="relative grid gap-6 p-6 sm:grid-cols-[1.1fr,0.9fr] sm:p-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Sparkles className="h-4 w-4" />
                  {t("home.activity", "Live activity")}
                </div>
                <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
                  {t("home.subtitle", "Launch a canvas and adapt for IG, TikTok & LinkedIn in 15s.")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t(
                    "hero.subtitle",
                    "Motion templates, auto ratios, brand kit applied. Choose a mode, we handle alignment, safe zones and exports.",
                  )}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/studio/ai">
                    <Button size="lg" className="gap-2 rounded-full px-6">
                      {t("studio.ai.headerTitle", "AI Generator")} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/studio/manual">
                    <Button variant="ghost" size="lg" className="rounded-full px-6">
                      {t("studio.manual.headerTitle", "Manual Editor")}
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                    {t("home.summary.safeZones", "Safe zones verified")}
                  </span>
                  <span className="flex items-center gap-2 rounded-full bg-card/70 px-3 py-1">
                    <Clock3 className="h-4 w-4 text-accent" />
                    {t("home.summary.timeSaved", "+6h saved / week")}
                  </span>
                  <span className="flex items-center gap-2 rounded-full bg-card/70 px-3 py-1">
                    <Star className="h-4 w-4 text-primary" />
                    {t("home.summary.creators", "4.9/5 creators")}
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-inner">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t("home.summary.title", "Studio summary")}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                    {t("common.live", "Live")}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Wand2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t("home.summary.genTitle", "AI generations")}</p>
                        <p className="text-xs text-muted-foreground">
                          {t("home.summary.genSubtitle", "Ready in 15s • 3 ratios")}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">
                      {t("home.summary.genBadge", "+3 today")}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                        <PlaySquare className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t("templatesPreview.filters.motion", "Motion templates")}</p>
                        <p className="text-xs text-muted-foreground">{t("templatesPreview.note", "Stories, Reels, carousels")}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="rounded-full">
                      6 {t("templates.favorites", "Favorites")}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Coins className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t("home.credits.remaining", "Credits remaining")}</p>
                      <p className="text-xs text-muted-foreground">{t("home.credits.anytime", "Recharge anytime")}</p>
                    </div>
                  </div>
                  <span className="text-lg font-semibold">{user?.credits ?? 0}</span>
                </div>
              </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <Card className="rounded-2xl border-border/70 bg-card/80">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-primary">{t("home.goal.title", "Publish 5 posts")}</p>
                    <h3 className="text-xl font-semibold">{t("home.goal.title", "Publish 5 posts")}</h3>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Flame className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-border">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${Math.min((posts.length / 5) * 100, 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {posts.length >= 5
                    ? t("home.goal.done", "Goal reached!")
                    : `${Math.max(0, 5 - posts.length)} ${t("home.goal.remaining", "left to publish this week.")}`}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-border/70 bg-card/80">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-primary">
                      {t("home.activity.title", "Activity")}
                    </p>
                    <h3 className="text-lg font-semibold">
                      {t("home.activity.subtitle", "Real-time tracking")}
                    </h3>
                  </div>
                  <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">
                    {t("common.live", "Live")}
                  </Badge>
                </div>
                <div className="mt-4 space-y-3">
                  {activity.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-card/70 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                      <span className="text-xs font-semibold text-primary">{item.status}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="rounded-2xl border-border/70 bg-card/80">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-semibold">{stat.value}</p>
                  </div>
                </div>
                {stat.hint && <p className="text-xs text-muted-foreground">{stat.hint}</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr,0.9fr]">
          <Card className="rounded-2xl border-border/70 bg-card/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary">{t("home.quickActions", "Create in seconds")}</p>
                  <h3 className="text-lg font-semibold">{t("home.quickActions", "Create in seconds")}</h3>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.href}>
                    <div className="group h-full rounded-2xl border border-border/70 bg-gradient-to-br from-transparent via-card to-primary/5 p-4 shadow-sm transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-primary`}>
                          <action.icon className="h-5 w-5" />
                        </div>
                        <Badge variant="secondary" className="rounded-full text-xs">
                          {action.badge}
                        </Badge>
                      </div>
                      <h4 className="mt-3 font-semibold">{action.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                      <div className="mt-3 inline-flex items-center gap-1 text-xs text-primary">
                        {t("home.quickActions.cta", "Start")} <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 bg-card/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary">{t("home.checklist.title", "Ready to publish")}</p>
                  <h3 className="text-lg font-semibold">{t("home.checklist.title", "Ready to publish")}</h3>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {checklist.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/70 px-4 py-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary">
                {t("home.templates.title", "Favorite templates")}
              </p>
              <h3 className="text-lg font-semibold">{t("home.templates.subtitle", "Pick a base")}</h3>
            </div>
            <Link href="/templates">
              <Button variant="ghost" size="sm" className="rounded-full">
                {t("home.templates.viewAll", "View all")}
              </Button>
            </Link>
          </div>
          <div className="flex snap-x gap-4 overflow-x-auto pb-2">
            {featuredTemplates.map((template) => (
              <div
                key={template.id}
                className="min-w-[200px] snap-start overflow-hidden rounded-xl border border-border/70 bg-card/80 shadow-sm transition hover:-translate-y-1 hover:border-primary/50"
              >
                <div
                  className="relative aspect-[4/5]"
                  style={{
                    background: template.backgroundType === "gradient" ? template.gradient : template.backgroundColor,
                    border: template.borderColor ? `${template.borderWidth || 2}px solid ${template.borderColor}` : undefined,
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
                    <p className="text-sm font-semibold">{template.preview}</p>
                  </div>
                  {template.isPremium && (
                    <div className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 text-[11px] font-semibold text-amber-300">
                      {t("home.premium.badge", "Exclusive")}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-xs text-white/90">
                    {template.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary">{t("home.recent.title", "Recent posts")}</p>
              <h3 className="text-lg font-semibold">{t("home.recent.title", "Recent posts")}</h3>
            </div>
            <Link href="/history">
              <Button variant="ghost" size="sm" className="rounded-full">
                {t("home.recent.cta", "History")}
              </Button>
            </Link>
            </div>
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/80 bg-card/80 px-6 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="font-semibold">{t("history.empty.title", "No posts yet")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("history.empty.subtitle", "Create your first post to see it here.")}
                </p>
                <Link href="/studio/ai">
                  <Button className="rounded-full">{t("home.recent.create", "Create now")}</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {posts.slice(0, 6).map((post) => (
                  <Link key={post.id} href="/history">
                    <div className="group overflow-hidden rounded-xl border border-border/70 bg-card/80 shadow-sm transition hover:-translate-y-1 hover:border-primary/50">
                      <div
                        className="relative aspect-[4/5]"
                        style={{
                          background: getPostBackground(post),
                          border: post.borderColor ? `${post.borderWidth || 2}px solid ${post.borderColor}` : "none",
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                          <p
                            className="line-clamp-5 text-center text-sm font-medium"
                            style={{
                              color: post.textColor || getTemplateForPost(post).textColor,
                              fontFamily: post.fontFamily || getTemplateForPost(post).fontFamily,
                            }}
                          >
                            {post.content}
                          </p>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-xs text-white/90">
                          {post.title}
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1 text-primary">
                          {t("home.recent.view", "View")} <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary">{t("home.premium.title", "Premium templates")}</p>
                <h3 className="text-lg font-semibold">{t("home.premium.title", "Boost visuals")}</h3>
              </div>
              <Badge variant="secondary" className="rounded-full bg-amber-500/15 text-amber-400">
                {t("home.premium.badge", "Exclusive")}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {premiumTemplates.map((template) => (
                <div
                  key={template.id}
                  className="overflow-hidden rounded-xl border border-border/70 bg-card/80 shadow-sm transition hover:-translate-y-1 hover:border-primary/50"
                >
                  <div
                    className="relative aspect-[4/5]"
                    style={{
                      background: template.backgroundType === "gradient" ? template.gradient : template.backgroundColor,
                      border: template.borderColor ? `${template.borderWidth || 2}px solid ${template.borderColor}` : undefined,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-3 text-center text-white">
                      <p className="text-xs font-semibold">{template.preview}</p>
                    </div>
                    <div className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold text-amber-300">
                      {t("home.premium.badge", "Premium")}
                    </div>
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold">{template.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{template.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {user && user.credits < 3 && (
          <Card className="rounded-2xl border border-primary/50 bg-primary/10">
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t("home.cta.lowCredits", "Credits running low")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("credits.current", "Credits")}: {user.credits}
                  </p>
                </div>
              </div>
              <Link href="/credits">
                <Button className="rounded-full">{t("home.cta.buy", "Buy credits")}</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

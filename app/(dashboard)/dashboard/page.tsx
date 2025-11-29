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
    { label: "Posts créés", value: posts.length, icon: TrendingUp, hint: "+3 cette semaine" },
    { label: "Crédits restants", value: user?.credits || 0, icon: Coins, hint: "Recharge dès 5 crédits" },
    { label: "Templates utilisés", value: uniqueTemplates, icon: Layout, hint: "Variez vos formats" },
    { label: "Temps gagné", value: "6h", icon: Clock3, hint: "VS design manuel" },
  ]

  const quickActions = [
    {
      title: "Générateur IA",
      description: "Brief 1 phrase, déclinaisons automatiques.",
      icon: Wand2,
      href: "/studio/ai",
      color: "from-primary/15 via-primary/10 to-accent/10",
      badge: "Rapide",
    },
    {
      title: "Éditeur manuel",
      description: "Contrôle total, grilles et calques verrouillables.",
      icon: Palette,
      href: "/studio/manual",
      color: "from-accent/15 via-card to-primary/10",
      badge: "Précis",
    },
    {
      title: "Bibliothèque templates",
      description: "Séries motion & carrousels prêts à poster.",
      icon: Layout,
      href: "/templates",
      color: "from-orange-400/15 via-primary/5 to-accent/10",
      badge: "Nouveau",
    },
  ]

  const featuredTemplates = templates.slice(0, 8)
  const premiumTemplates = templates.filter((t) => t.isPremium).slice(0, 6)

  const activity = [
    { label: "Brand kit appliqué", time: "Il y a 2h", status: "Succès" },
    { label: "Export MP4 (Reel)", time: "Il y a 4h", status: "Terminé" },
    { label: "Génération IA (quote)", time: "Hier", status: "OK" },
  ]

  const checklist = [
    "Configurer vos safe zones IG/LinkedIn",
    "Activer les templates motion favoris",
    "Uploader vos polices et logos",
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
        title={`Bonjour ${user?.name || "créateur"} 👋`}
        description="Un seul espace pour générer, animer et publier vos posts."
        action={
          <Link href="/templates">
            <Button size="sm" className="rounded-full">
              Explorer les templates
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
                  Flux quotidien
                </div>
                <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
                  Lancer un canvas et décliner pour IG, TikTok & LinkedIn en 15s.
                </h2>
                <p className="text-sm text-muted-foreground">
                  Templates motion, ratios auto, brand kit appliqué. Choisissez un mode, on s’occupe de l’alignement,
                  des safe zones et des exports.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/studio/ai">
                    <Button size="lg" className="gap-2 rounded-full px-6">
                      Générer avec l&apos;IA <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/studio/manual">
                    <Button variant="ghost" size="lg" className="rounded-full px-6">
                      Construire manuellement
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                    Safe zones vérifiées
                  </span>
                  <span className="flex items-center gap-2 rounded-full bg-card/70 px-3 py-1">
                    <Clock3 className="h-4 w-4 text-accent" />
                    +6h gagnées / semaine
                  </span>
                  <span className="flex items-center gap-2 rounded-full bg-card/70 px-3 py-1">
                    <Star className="h-4 w-4 text-primary" />
                    4.9/5 créateurs
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-inner">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Résumé studio</span>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">Live</span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Wand2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Générations IA</p>
                        <p className="text-xs text-muted-foreground">Prêt en 15s • 3 ratios</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">
                      +3 aujourd&apos;hui
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                        <PlaySquare className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Templates motion</p>
                        <p className="text-xs text-muted-foreground">Stories, Reels, carrousels</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="rounded-full">
                      6 en favoris
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Coins className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Crédits restants</p>
                        <p className="text-xs text-muted-foreground">Recharge à tout moment</p>
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
                    <p className="text-xs uppercase tracking-[0.18em] text-primary">Objectif semaine</p>
                    <h3 className="text-xl font-semibold">Publier 5 posts</h3>
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
                  {posts.length >= 5 ? "Objectif atteint !" : `${Math.max(0, 5 - posts.length)} à publier cette semaine.`}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-border/70 bg-card/80">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-primary">Activité</p>
                    <h3 className="text-lg font-semibold">Suivi en temps réel</h3>
                  </div>
                  <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">
                    Live
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
                  <p className="text-xs uppercase tracking-[0.2em] text-primary">Accès rapide</p>
                  <h3 className="text-lg font-semibold">Créer en quelques secondes</h3>
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
                        Commencer <ArrowRight className="h-3.5 w-3.5" />
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
                  <p className="text-xs uppercase tracking-[0.2em] text-primary">Checklist</p>
                  <h3 className="text-lg font-semibold">Prêt pour publier</h3>
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
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Templates favoris</p>
              <h3 className="text-lg font-semibold">Choisissez une base</h3>
            </div>
            <Link href="/templates">
              <Button variant="ghost" size="sm" className="rounded-full">
                Voir tout
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
                      Premium
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
                <p className="text-xs uppercase tracking-[0.2em] text-primary">Posts récents</p>
                <h3 className="text-lg font-semibold">Vos dernières créations</h3>
              </div>
              <Link href="/history">
                <Button variant="ghost" size="sm" className="rounded-full">
                  Historique
                </Button>
              </Link>
            </div>
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/80 bg-card/80 px-6 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="font-semibold">Pas encore de post</p>
                <p className="text-sm text-muted-foreground">Générez votre premier visuel pour le voir ici.</p>
                <Link href="/studio/ai">
                  <Button className="rounded-full">Créer maintenant</Button>
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
                          Voir <ArrowRight className="h-3.5 w-3.5" />
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
                <p className="text-xs uppercase tracking-[0.2em] text-primary">Templates premium</p>
                <h3 className="text-lg font-semibold">Boost visuel</h3>
              </div>
              <Badge variant="secondary" className="rounded-full bg-amber-500/15 text-amber-400">
                Exclusif
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
                      Premium
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
                  <h3 className="text-lg font-semibold">Crédits bientôt épuisés</h3>
                  <p className="text-sm text-muted-foreground">
                    Il vous reste {user.credits} crédits. Rechargez pour continuer à créer sans interruption.
                  </p>
                </div>
              </div>
              <Link href="/credits">
                <Button className="rounded-full">Acheter des crédits</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

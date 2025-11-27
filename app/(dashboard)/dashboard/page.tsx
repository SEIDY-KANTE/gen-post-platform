"use client"

import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { Wand2, Palette, Layout, TrendingUp, Sparkles, ArrowRight, Coins } from "lucide-react"

export default function DashboardPage() {
  const { user, posts } = useAppStore()

  const quickActions = [
    {
      title: "AI Generator",
      description: "Let AI create your post",
      icon: Wand2,
      href: "/studio/ai",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Manual Editor",
      description: "Create from scratch",
      icon: Palette,
      href: "/studio/manual",
      color: "bg-accent/10 text-accent",
    },
    {
      title: "Templates",
      description: "Start with a template",
      icon: Layout,
      href: "/templates",
      color: "bg-orange-500/10 text-orange-500",
    },
  ]

  const stats = [
    { label: "Posts Created", value: posts.length, icon: TrendingUp },
    { label: "Credits Left", value: user?.credits || 0, icon: Coins },
    { label: "Templates Used", value: 0, icon: Layout },
  ]

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title={`Welcome back, ${user?.name || "Creator"}!`}
        description="Create stunning social media posts with AI"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card className="h-full transition-all hover:border-primary hover:shadow-lg">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-semibold">{action.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                    <div className="mt-auto pt-4">
                      <Button variant="ghost" size="sm" className="gap-1 p-0">
                        Get started <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Posts</h2>
            <Link href="/history">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </div>
          {posts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Sparkles className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-semibold">No posts yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">Create your first post to see it here</p>
                <Link href="/studio/ai" className="mt-4">
                  <Button>Create Your First Post</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {posts.slice(0, 4).map((post) => (
                <Card key={post.id}>
                  <div className="aspect-square bg-muted" />
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate">{post.title}</h3>
                    <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Credits CTA */}
        {user && user.credits < 3 && (
          <Card className="border-primary bg-primary/5">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Running low on credits</h3>
                  <p className="text-sm text-muted-foreground">
                    You have {user.credits} credits left. Buy more to keep creating!
                  </p>
                </div>
              </div>
              <Link href="/credits">
                <Button>Buy Credits</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

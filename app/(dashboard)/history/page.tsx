"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { PreviewCanvas } from "@/components/studio/preview-canvas"
import { ShareButtons } from "@/components/studio/share-buttons"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAppStore, type GeneratedPost } from "@/lib/store"
import { useAuth } from "@/lib/hooks/useAuth"
import { templates, type PlatformKey } from "@/lib/templates"
import { Sparkles, Download, Trash2, Eye, Calendar, Layout, Loader2, Search, Filter } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useI18n } from "@/lib/i18n"

export default function HistoryPage() {
  const { user } = useAuth()
  const { posts, fetchPosts, deletePost } = useAppStore()
  const [viewingPost, setViewingPost] = useState<GeneratedPost | null>(null)
  const [deletingPost, setDeletingPost] = useState<GeneratedPost | null>(null)
  const [exportTrigger, setExportTrigger] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState<"all" | PlatformKey>("all")
  const { t } = useI18n()

  // Fetch posts on mount
  useEffect(() => {
    if (user?.id) {
      setIsLoading(true)
      fetchPosts(user.id).finally(() => setIsLoading(false))
    }
  }, [user?.id, fetchPosts])

  const handleExportClick = () => {
    setExportTrigger((t) => t + 1)
  }

  const handleExportCallback = useCallback((dataUrl: string) => {
    if (!viewingPost) return
    const link = document.createElement("a")
    link.download = `genpost-${viewingPost.platform}-${Date.now()}.png`
    link.href = dataUrl
    link.click()
    toast.success("Post exported successfully!")
  }, [viewingPost])

  const handleDelete = async () => {
    if (!deletingPost || !deletingPost.id) {
      toast.error("Invalid post selected")
      return
    }

    try {
      // Call API to delete from database
      const response = await fetch(`/api/posts/${deletingPost.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Delete failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })
        throw new Error(errorData.error || 'Failed to delete post')
      }

      // Update local state
      deletePost(deletingPost.id)
      toast.success("Post deleted")
      setDeletingPost(null)
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(error instanceof Error ? error.message : "Failed to delete post")
    }
  }

  const getTemplateForPost = (post: GeneratedPost) => {
    return templates.find((t) => t.id === post.template) || templates[0]
  }

  const getPostBackground = (post: GeneratedPost) => {
    if (post.gradient) return post.gradient
    if (post.backgroundColor) return post.backgroundColor
    const template = getTemplateForPost(post)
    return template.gradient || template.backgroundColor || "#667eea"
  }

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        const matchesPlatform = platformFilter === "all" || post.platform === platformFilter
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          post.title?.toLowerCase().includes(query) ||
          post.content?.toLowerCase().includes(query) ||
          getTemplateForPost(post).name.toLowerCase().includes(query)
        return matchesPlatform && (!query || matchesSearch)
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [posts, platformFilter, searchQuery])

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title={t("history.headerTitle", "History")}
        description={t("history.headerDesc", "Find, filter and re-export your creations.")}
        action={
          <div className="hidden gap-2 sm:flex">
            <Link href="/studio/ai">
              <Button size="sm" className="rounded-full">
                {t("templates.mode.launchAI", "Launch AI")}
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline" size="sm" className="rounded-full">
                {t("templates.title", "Templates")}
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-4 max-w-6xl mx-auto md:p-6">
        {isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Loading your posts...</p>
            </CardContent>
          </Card>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Sparkles className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No posts yet</h3>
              <p className="mt-1 text-muted-foreground">Your generated posts will appear here</p>
              <Link href="/studio/ai" className="mt-6">
                <Button>Create Your First Post</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t("history.search", "Search by title, content or template...")}
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={platformFilter} onValueChange={(v) => setPlatformFilter(v as PlatformKey | "all")}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Plateforme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("history.filter.all", "All platforms")}</SelectItem>
                    <SelectItem value="instagram-square">Instagram</SelectItem>
                    <SelectItem value="instagram-story">Story</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">X / Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                  <p className="font-semibold">{t("history.noResults.title", "No matching posts")}</p>
                  <p className="text-sm text-muted-foreground">{t("history.noResults.subtitle", "Try another filter or create a new visual.")}</p>
                  <Link href="/studio/ai">
                    <Button className="rounded-full mt-2">{t("templates.mode.launchAI", "Launch AI")}</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="group overflow-hidden rounded-2xl border-border/70 bg-card/80 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg">
                {/* Thumbnail preview */}
                <div
                  className="relative aspect-square"
                  style={{
                    background: getPostBackground(post),
                    border: post.borderColor ? `${post.borderWidth || 2}px solid ${post.borderColor}` : "none",
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <p
                      className="line-clamp-4 text-center text-sm font-medium"
                      style={{
                        color: post.textColor || getTemplateForPost(post).textColor,
                        fontFamily: post.fontFamily || getTemplateForPost(post).fontFamily,
                      }}
                    >
                      {post.content}
                    </p>
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button size="sm" variant="secondary" onClick={() => setViewingPost(post)}>
                      <Eye className="mr-1 h-3 w-3" />
                      {t("history.action.view", "View")}
                    </Button>
                  </div>
                  </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-medium">{post.title || t("history.empty.title", "Untitled Post")}</h3>
                      {/* Date is shown locale-neutral for now; could format with Intl.DateTimeFormat per locale */}
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      <Layout className="mr-1 h-3 w-3" />
                      {post.platform}
                    </Badge>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1 bg-transparent"
                      onClick={() => setViewingPost(post)}
                    >
                      <Eye className="h-3 w-3" />
                      {t("history.action.view", "View")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeletingPost(post)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* View Post Dialog - Use saved post styling, not template fallbacks */}
      <Dialog
        open={!!viewingPost}
        onOpenChange={(open) => {
          if (!open) {
            setViewingPost(null)
            setExportTrigger(0) // Reset export trigger when closing
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewingPost?.title || t("history.action.view", "View")}</DialogTitle>
            <DialogDescription>
              Created on {viewingPost && new Date(viewingPost.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center py-4">
            {viewingPost && (
              <PreviewCanvas
                platform={viewingPost.platform as PlatformKey}
                content={viewingPost.content}
                author={viewingPost.author}
                gradient={viewingPost.gradient}
                backgroundColor={viewingPost.backgroundColor}
                borderColor={viewingPost.borderColor}
                borderWidth={viewingPost.borderWidth || 0}
                textColor={viewingPost.textColor || "#ffffff"}
                accentColor={viewingPost.accentColor}
                fontFamily={viewingPost.fontFamily || "Inter"}
                fontWeight={viewingPost.fontWeight || 700}
                fontSize={viewingPost.fontSize || 24}
                textAlign={viewingPost.textAlign || "center"}
                padding={viewingPost.padding || 40}
                backgroundImage={viewingPost.backgroundImage}
                onExport={handleExportCallback}
                exportTrigger={exportTrigger}
              />
            )}
          </div>

          {/* Share Buttons */}
          {viewingPost?.thumbnail && (
            <div className="px-6 pb-4">
              <ShareButtons
                imageDataUrl={viewingPost.thumbnail}
                content={viewingPost.content}
                platform={viewingPost.platform}
                onDownload={handleExportClick}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingPost(null)}>
              {t("history.action.close", "Close")}
            </Button>
            <Button onClick={handleExportClick} className="gap-2">
              <Download className="h-4 w-4" />
              {t("history.action.export", "Export PNG")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingPost} onOpenChange={(open) => !open && setDeletingPost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingPost?.title || "this post"}&quot;? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

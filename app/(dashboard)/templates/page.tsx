"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { templates, templateCategories, type Template } from "@/lib/templates"
import { Search, Wand2, Palette, Lock, Sparkles, Star } from "lucide-react"

export default function TemplatesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("favoriteTemplates") : null
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch {
        setFavorites([])
      }
    }
  }, [])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
      if (typeof window !== "undefined") {
        window.localStorage.setItem("favoriteTemplates", JSON.stringify(next))
      }
      return next
    })
  }

  const categories = [{ id: "favorites", label: "Favoris" }, ...templateCategories]

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all"
        ? true
        : selectedCategory === "favorites"
          ? favorites.includes(template.id)
          : template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleUseTemplate = (template: Template, mode: "ai" | "manual") => {
    // Store template in sessionStorage for the editor to pick up
    sessionStorage.setItem("selectedTemplate", JSON.stringify(template))
    router.push(`/studio/${mode}`)
  }

  const getTemplateBackground = (template: Template) => {
    if (template.backgroundType === "gradient" && template.gradient) {
      return template.gradient
    }
    return template.backgroundColor || "#667eea"
  }

  const getTemplateBorder = (template: Template) => {
    if (template.borderColor && template.borderWidth) {
      return `${template.borderWidth}px solid ${template.borderColor}`
    }
    return "none"
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Templates"
        description="Choisissez un style, appliquez-le directement en mode IA ou manuel."
        action={
          <Button size="sm" className="rounded-full" onClick={() => router.push("/studio/ai")}>
            Lancer l&apos;IA
          </Button>
        }
      />

      <div className="p-4 md:p-6">
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Sparkles className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No templates found</h3>
              <p className="mt-1 text-muted-foreground">Try adjusting your search or filter</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="group overflow-hidden transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg"
                onClick={() => handleUseTemplate(template, "ai")}
                role="button"
              >
                <div
                  className="relative aspect-square flex items-center justify-center p-6 text-center transition-transform group-hover:scale-[1.02]"
                  style={{
                    background: getTemplateBackground(template),
                    border: getTemplateBorder(template),
                  }}
                >
                  <p
                    style={{
                      color: template.textColor,
                      fontFamily: template.fontFamily,
                      fontSize: `${Math.min(template.fontSize * 0.6, 20)}px`,
                      fontWeight: template.fontWeight || 700,
                    }}
                  >
                    {template.preview || template.name}
                  </p>

                  {template.accentColor && (
                    <span className="absolute bottom-4 text-sm" style={{ color: template.accentColor }}>
                      — Author
                    </span>
                  )}

                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-full text-[11px] capitalize">
                      {template.category}
                    </Badge>
                    {template.isPremium && (
                      <Badge className="gap-1 rounded-full bg-amber-400/90 text-amber-950">
                        <Lock className="h-3 w-3" />
                        Pro
                      </Badge>
                    )}
                  </div>
                  <button
                    className="absolute right-3 top-3 rounded-full bg-black/30 p-1 text-white opacity-80 transition hover:bg-black/50"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(template.id)
                    }}
                    aria-label="Ajouter aux favoris"
                  >
                    <Star className={`h-4 w-4 ${favorites.includes(template.id) ? "fill-yellow-400 text-yellow-300" : ""}`} />
                  </button>

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/55 px-3 py-2 opacity-90">
                    <Button size="sm" variant="default" className="gap-1 rounded-full" onClick={(e) => { e.stopPropagation(); handleUseTemplate(template, "ai") }}>
                      <Wand2 className="h-4 w-4" />
                      Mode IA
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="gap-1 rounded-full"
                      onClick={(e) => { e.stopPropagation(); handleUseTemplate(template, "manual") }}
                    >
                      <Palette className="h-4 w-4" />
                      Manuel
                    </Button>
                  </div>
                </div>

                {/* Template Info */}
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-xs capitalize text-muted-foreground">{template.category}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pro Templates CTA */}
        <Card className="mt-12 border-primary bg-primary/5">
          <CardContent className="flex flex-col items-center justify-between gap-4 p-8 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Unlock Premium Templates</h3>
                <p className="text-muted-foreground">Get access to exclusive designs and unlimited customization</p>
              </div>
            </div>
            <Button size="lg">Upgrade to Pro</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

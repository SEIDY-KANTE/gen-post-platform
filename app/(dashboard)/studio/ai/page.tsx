"use client"

import { useState, useCallback, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { PreviewCanvas } from "@/components/studio/preview-canvas"
import { CreditsModal } from "@/components/studio/credits-modal"
import { ExportDialog } from "@/components/studio/export-dialog"
import { ImageUpload } from "@/components/studio/image-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppStore } from "@/lib/store"
import { templates, platformSizes, styleOptions, toneOptions, type PlatformKey, type Template } from "@/lib/templates"
import { toast } from "sonner"
import { Sparkles, Wand2, Download, Palette, Loader2, Coins, Crown, ImageIcon, Eye, EyeOff, Search, Star } from "lucide-react"
import { ShareButtons } from "@/components/studio/share-buttons"
import { useI18n } from "@/lib/i18n"

export default function AIStudioPage() {
  const { user, setUser, consumeCredit, addPost } = useAppStore()
  const [topic, setTopic] = useState("")
  const [style, setStyle] = useState("motivational")
  const [tone, setTone] = useState("professional")
  const [platform, setPlatform] = useState<PlatformKey>("instagram-square")
  const [isGenerating, setIsGenerating] = useState(false)
  const [content, setContent] = useState(
    "Your AI-generated content will appear here. Describe your idea and let the magic happen!",
  )
  const [author, setAuthor] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0])
  const [backgroundType, setBackgroundType] = useState<"gradient" | "solid">(templates[0].backgroundType)
  const [gradient, setGradient] = useState(templates[0].gradient || "")
  const [backgroundColor, setBackgroundColor] = useState(templates[0].backgroundColor || "")
  const [borderColor, setBorderColor] = useState(templates[0].borderColor || "")
  const [borderWidth, setBorderWidth] = useState(templates[0].borderWidth || 0)
  const [textColor, setTextColor] = useState(templates[0].textColor)
  const [accentColor, setAccentColor] = useState(templates[0].accentColor || "")
  const [fontFamily, setFontFamily] = useState(templates[0].fontFamily)
  const [fontWeight, setFontWeight] = useState(templates[0].fontWeight || 700)
  const [fontSize, setFontSize] = useState(templates[0].fontSize)
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">(templates[0].textAlign)
  const [padding, setPadding] = useState(templates[0].padding)
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("")
  const [exportTrigger, setExportTrigger] = useState(0)
  const [showCreditsModal, setShowCreditsModal] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("templates")
  const [showPreview, setShowPreview] = useState(true) // Mobile preview toggle
  const [templateSearch, setTemplateSearch] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const { t } = useI18n()

  const isPro = user?.plan === "pro" || user?.plan === "premium"
  const isFreeUser = !user || user.plan === "free"

  const generateContent = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic or idea")
      return
    }

    if (!user || user.credits <= 0) {
      setShowCreditsModal(true)
      return
    }

    setIsGenerating(true)

    try {
      // Call the real AI API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          style,
          tone,
          platform,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          toast.error("Please login to generate content")
          return
        }
        if (response.status === 403) {
          toast.error("Insufficient credits. Please purchase more.")
          setShowCreditsModal(true)
          return
        }
        throw new Error(data.error || 'Generation failed')
      }

      // Set the generated content
      setContent(data.content)

      // Switch to text tab to allow editing
      setActiveTab("text")

      // Update credits in store (optimistic update)
      if (user) {
        const newCredits = data.creditsRemaining ?? user.credits - 1
        setUser({ ...user, credits: newCredits })
      }

      toast.success(`Content generated! ${data.creditsRemaining ?? user.credits - 1} credits remaining.`)
    } catch (error) {
      console.error('Generation error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content'
      toast.error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExport = useCallback(
    async (dataUrl: string) => {
      // Download the image first
      const link = document.createElement("a")
      link.download = `genpost-${platform}-${Date.now()}.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setPreviewImageUrl(dataUrl)

      // Then save to history and WAIT for completion
      try {
        await addPost({
          title: topic || "Untitled Post",
          content,
          template: selectedTemplate.id,
          platform,
          thumbnail: dataUrl,
          author,
          gradient: backgroundType === "gradient" ? gradient : undefined,
          backgroundColor: backgroundType === "solid" ? backgroundColor : undefined,
          borderColor,
          borderWidth,
          textColor,
          accentColor,
          fontFamily,
          fontWeight,
          fontSize,
          textAlign,
          padding,
          backgroundImage: backgroundImage || undefined,
        })
        toast.success('Post exported and saved!')
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.error('Failed to save post:', error)
        toast.error(`Post exported but failed to save to history: ${message}`)
      }
    },
    [
      platform,
      topic,
      content,
      selectedTemplate.id,
      addPost,
      author,
      backgroundType,
      gradient,
      backgroundColor,
      borderColor,
      borderWidth,
      textColor,
      accentColor,
      fontFamily,
      fontWeight,
      fontSize,
      textAlign,
      padding,
      backgroundImage,
    ],
  )

  const handleTemplateSelect = (template: Template) => {
    if (template.isPremium && !isPro) {
      toast.error("This template requires a Pro subscription")
      return
    }

    setSelectedTemplate(template)
    setBackgroundType(template.backgroundType)
    setGradient(template.gradient || "")
    setBackgroundColor(template.backgroundColor || "")
    setBorderColor(template.borderColor || "")
    setBorderWidth(template.borderWidth || 0)
    setTextColor(template.textColor)
    setAccentColor(template.accentColor || "")
    setFontFamily(template.fontFamily)
    setFontWeight(template.fontWeight || 700)
    setFontSize(template.fontSize)
    setTextAlign(template.textAlign)
    setPadding(template.padding)
    setBackgroundImage(null)
    toast.success(`Applied "${template.name}" template`)
  }

  const handleAdvancedExport = (format: "png" | "jpg", exportPlatform: PlatformKey) => {
    if (exportPlatform !== platform) {
      setPlatform(exportPlatform)
    }
    // Don't automatically trigger export - user needs to click Export button
    // setTimeout(() => setExportTrigger((t) => t + 1), 100)
  }

  // Apply template coming from Templates page
  useEffect(() => {
    const stored = sessionStorage.getItem("selectedTemplate")
    if (stored) {
      try {
        const template: Template = JSON.parse(stored)
        handleTemplateSelect(template)
        setActiveTab("templates")
      } catch (e) {
        console.error("Failed to apply stored template", e)
      }
    }
  }, [])

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

  const downloadPreview = useCallback(() => {
    if (!previewImageUrl) {
      toast.error("Preview not ready yet. Please try again.")
      return
    }
    const link = document.createElement("a")
    link.download = `genpost-${platform}-${Date.now()}.png`
    link.href = previewImageUrl
    link.click()
  }, [platform, previewImageUrl])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
      if (typeof window !== "undefined") {
        window.localStorage.setItem("favoriteTemplates", JSON.stringify(next))
      }
      return next
    })
  }

  const filteredTemplates = templates.filter((template) => {
    if (!templateSearch.trim()) return true
    const q = templateSearch.toLowerCase()
    return template.name.toLowerCase().includes(q) || template.category.toLowerCase().includes(q)
  })

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-y-auto">
      <DashboardHeader title={t("studio.ai.headerTitle", "AI Generator")} description={t("studio.ai.headerDesc", "Brief in one line and get social-ready canvases.")} />

      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:flex-row lg:overflow-hidden">
        {/* Mobile Preview Toggle */}
        <div className="sticky top-0 z-30 lg:hidden">
          <div className="bg-background/95 pb-2 pt-1 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="w-full gap-2"
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? t("studio.ai.preview", "Preview") : t("studio.ai.preview", "Preview")}
            </Button>
          </div>
        </div>

        {/* Mobile Preview (Sticky Top) */}
        {showPreview && (
          <div className="sticky top-14 z-20 lg:hidden">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Preview</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {platformSizes[platform].width} x {platformSizes[platform].height}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <PreviewCanvas
                  platform={platform}
                  content={content}
                  author={author}
                  gradient={backgroundType === "gradient" ? gradient : undefined}
                  backgroundColor={backgroundType === "solid" ? backgroundColor : undefined}
                  borderColor={borderColor}
                  borderWidth={borderWidth}
                  textColor={textColor}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  fontWeight={fontWeight}
                  fontSize={fontSize}
                  textAlign={textAlign}
                  padding={padding}
                  backgroundImage={backgroundImage || undefined}
                  showWatermark={isFreeUser}
                  watermarkLabel={`GenPost Free • ${platformSizes[platform].label}`}
                  onRender={setPreviewImageUrl} 
                  onExport={handleExport}
                  exportTrigger={exportTrigger}
                  maxHeight="30vh"
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Left Panel - Controls (Scrollable) */}
        <ScrollArea className="w-full flex-1 lg:flex-none lg:w-96 lg:min-h-0" viewportClassName="h-auto lg:h-full">
          <div className="space-y-6 pr-4">
            {/* Credits indicator */}
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-primary" />
                  <span className="font-medium">{t("studio.ai.credit", "Credits")}</span>
                </div>
                <Badge variant="secondary" className="text-lg">
                  {user?.credits || 0}
                </Badge>
              </CardContent>
            </Card>

            {/* AI Generation Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">{t("studio.ai.topic", "Topic / Idea")}</Label>
                  <Textarea
                    id="topic"
                    placeholder={t("studio.ai.topic.placeholder", "e.g., Success requires persistence and dedication...")}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>{t("studio.ai.style", "Style")}</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {styleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {t(`styles.${option.value}`, option.label)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("studio.ai.tone", "Tone")}</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {toneOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {t(`tone.${option.value}`, option.label)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("studio.ai.platform", "Platform")}</Label>
                  <Select value={platform} onValueChange={(v) => setPlatform(v as PlatformKey)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(platformSizes).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">{t("studio.ai.author", "Author (optional)")}</Label>
                  <Input
                    id="author"
                    placeholder="Your name or brand"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>

                <Button onClick={generateContent} disabled={isGenerating} className="w-full gap-2">
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("studio.ai.generating", "Generating...")}
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      {t("studio.ai.generate", "Generate with AI")}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Customization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Customize
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="secondary" className="rounded-full text-xs">
                    {t("studio.ai.activeTemplate", "Template actif")}: {selectedTemplate.name}
                  </Badge>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Favoris: {favorites.length}</span>
                  </div>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="templates">{t("studio.ai.templates", "Templates")}</TabsTrigger>
                    <TabsTrigger value="text">{t("studio.ai.text", "Text")}</TabsTrigger>
                    <TabsTrigger value="style">{t("studio.ai.styleTab", "Style")}</TabsTrigger>
                    <TabsTrigger value="image" className="gap-1">
                      <ImageIcon className="h-3 w-3" />
                      {t("studio.ai.image", "Image")}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="templates" className="mt-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("studio.ai.templateSearch", "Rechercher un template...")}
                        value={templateSearch}
                        onChange={(e) => setTemplateSearch(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {filteredTemplates.slice(0, 24).map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateSelect(template)}
                          className={`relative aspect-square rounded-lg p-2 text-[10px] font-medium transition-all ${selectedTemplate.id === template.id ? "ring-2 ring-primary ring-offset-2" : ""
                            }`}
                          style={{
                            background:
                              template.backgroundType === "gradient" ? template.gradient : template.backgroundColor,
                            color: template.textColor,
                            border: template.borderColor
                              ? `${template.borderWidth || 2}px solid ${template.borderColor}`
                              : "none",
                          }}
                        >
                          <span className="line-clamp-2">{template.name}</span>
                          {template.isPremium && <Crown className="absolute right-1 top-1 h-3 w-3 text-yellow-400" />}
                          <span
                            role="button"
                            tabIndex={0}
                            className="absolute right-1 bottom-1 rounded-full bg-black/30 p-1 text-white transition hover:bg-black/50"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(template.id)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault()
                                toggleFavorite(template.id)
                              }
                            }}
                            aria-label="Toggle favorite"
                          >
                            <Star className={`h-3.5 w-3.5 ${favorites.includes(template.id) ? "fill-yellow-400 text-yellow-300" : ""}`} />
                          </span>
                        </button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="content-edit">{t("studio.ai.postContent", "Post Content")}</Label>
                      <Textarea
                        id="content-edit"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                        placeholder={t("studio.ai.contentPlaceholder", "Generated content will appear here...")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author-edit">{t("studio.ai.authorBrand", "Author / Brand")}</Label>
                      <Input
                        id="author-edit"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder={t("studio.ai.authorPlaceholder", "Your name")}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="style" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Font Size: {fontSize}px</Label>
                      <input
                        type="range"
                        min="16"
                        max="48"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Text Alignment</Label>
                      <div className="flex gap-2">
                        {(["left", "center", "right"] as const).map((align) => (
                          <Button
                            key={align}
                            variant={textAlign === align ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTextAlign(align)}
                            className="flex-1 capitalize"
                          >
                            {align}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Text Color</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="h-10 w-10 cursor-pointer rounded border-none"
                        />
                        <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="flex-1" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="image" className="mt-4">
                    <ImageUpload onImageSelect={setBackgroundImage} currentImage={backgroundImage} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Export & Share */}
            <Card>
              <CardContent className="space-y-4 p-4">
                <div className="flex gap-2">
                  <Button onClick={() => setExportTrigger((t) => t + 1)} className="flex-1 gap-2" size="lg">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button onClick={() => setShowExportDialog(true)} variant="outline" size="lg">
                    Options
                  </Button>
                </div>
                <ShareButtons
                  imageDataUrl={previewImageUrl}
                  content={content}
                  platform={platform}
                  onDownload={downloadPreview}
                />
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Desktop Preview (Right Panel - Always Visible) */}
        <div className="hidden flex-1 lg:block">
          <div className="sticky top-6">
            <div className="flex max-h-[calc(100vh-3rem)] flex-col gap-4 overflow-y-auto pr-3 pb-36">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t("studio.ai.preview", "Preview")}</CardTitle>
                    <Badge variant="outline">
                      {platformSizes[platform].width} x {platformSizes[platform].height}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-8">
                  <PreviewCanvas
                    platform={platform}
                    content={content}
                    author={author}
                    gradient={backgroundType === "gradient" ? gradient : undefined}
                    backgroundColor={backgroundType === "solid" ? backgroundColor : undefined}
                    borderColor={borderColor}
                    borderWidth={borderWidth}
                    textColor={textColor}
                    accentColor={accentColor}
                    fontFamily={fontFamily}
                    fontWeight={fontWeight}
                    fontSize={fontSize}
                    textAlign={textAlign}
                    padding={padding}
                    backgroundImage={backgroundImage || undefined}
                    showWatermark={isFreeUser}
                    watermarkLabel={`GenPost Free • ${platformSizes[platform].label}`}
                    onRender={setPreviewImageUrl}
                    onExport={handleExport}
                    exportTrigger={exportTrigger}
                    exportEvenIfHidden
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Multi-preview</CardTitle>
                  <p className="text-xs text-muted-foreground">Vérifiez rapidement le cadrage en 9:16, 1:1 et Story.</p>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-3">
                  {["tiktok", "instagram-square", "instagram-story"].map((p) => (
                    <div key={p} className="rounded-lg border border-border/70 bg-card/60 p-2 text-center text-xs">
                      <p className="mb-2 font-semibold">{platformSizes[p as PlatformKey].label}</p>
                      <PreviewCanvas
                        platform={p as PlatformKey}
                        content={content}
                        author={author}
                        gradient={backgroundType === "gradient" ? gradient : undefined}
                        backgroundColor={backgroundType === "solid" ? backgroundColor : undefined}
                        borderColor={borderColor}
                        borderWidth={borderWidth}
                        textColor={textColor}
                        accentColor={accentColor}
                        fontFamily={fontFamily}
                        fontWeight={fontWeight}
                        fontSize={fontSize}
                        textAlign={textAlign}
                        padding={padding}
                        backgroundImage={backgroundImage || undefined}
                        showWatermark={isFreeUser}
                        watermarkLabel={`GenPost Free • ${platformSizes[p as PlatformKey].label}`}
                        maxHeight="200px"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <CreditsModal open={showCreditsModal} onOpenChange={setShowCreditsModal} />
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={handleAdvancedExport}
        currentPlatform={platform}
      />
    </div>
  )
}

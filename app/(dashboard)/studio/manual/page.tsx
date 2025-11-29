"use client"

import { useState, useCallback } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { PreviewCanvas } from "@/components/studio/preview-canvas"
import { ImageUpload } from "@/components/studio/image-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppStore } from "@/lib/store"
import { templates, platformSizes, type PlatformKey, type Template } from "@/lib/templates"
import { gradientPresets, solidColors, fontFamilies } from "@/lib/gradients"
import { toast } from "sonner"
import {
  Palette,
  Type,
  Download,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Droplet,
  RefreshCw,
  Crown,
  ImageIcon,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react"
import { ExportDialog } from "@/components/studio/export-dialog"
import { ShareButtons } from "@/components/studio/share-buttons"

export default function ManualStudioPage() {
  const { addPost, user } = useAppStore()

  // Content state
  const [content, setContent] = useState("Your text here. Start typing to see it come to life!")
  const [author, setAuthor] = useState("")

  // Platform
  const [platform, setPlatform] = useState<PlatformKey>("instagram-square")

  // Background state
  const [backgroundType, setBackgroundType] = useState<"gradient" | "solid" | "custom">("gradient")
  const [gradient, setGradient] = useState(gradientPresets[0].value)
  const [solidColor, setSolidColor] = useState("#667eea")
  const [customGradient, setCustomGradient] = useState({ color1: "#667eea", color2: "#764ba2", angle: 135 })

  const [borderColor, setBorderColor] = useState("")
  const [borderWidth, setBorderWidth] = useState(0)
  const [accentColor, setAccentColor] = useState("")

  // Typography state
  const [fontFamily, setFontFamily] = useState("Inter")
  const [fontWeight, setFontWeight] = useState(700)
  const [fontSize, setFontSize] = useState(32)
  const [textColor, setTextColor] = useState("#ffffff")
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center")
  const [padding, setPadding] = useState(40)

  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)

  // Export
  const [exportTrigger, setExportTrigger] = useState(0)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(true) // Mobile preview toggle

  const canUseCustomBackground = user?.plan === "premium" || user?.plan === "pro"
  const canUseImages = user?.plan === "pro"

  const handleExport = useCallback(
    async (dataUrl: string) => {
      // Download the image first
      const link = document.createElement("a")
      link.download = `genpost-${platform}-${Date.now()}.png`
      link.href = dataUrl
      link.click()

      // Then save to history and WAIT for completion
      try {
        await addPost({
          title: content.substring(0, 30) + "...",
          content,
          template: "custom",
          platform,
          thumbnail: dataUrl,
          author,
          gradient:
            backgroundType === "gradient"
              ? gradient
              : backgroundType === "custom"
                ? `linear-gradient(${customGradient.angle}deg, ${customGradient.color1} 0%, ${customGradient.color2} 100%)`
                : undefined,
          backgroundColor: backgroundType === "solid" ? solidColor : undefined,
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
        console.error('Failed to save post:', error)
        toast.error('Post exported but failed to save to history')
      }
    },
    [
      platform,
      content,
      addPost,
      author,
      backgroundType,
      gradient,
      solidColor,
      customGradient,
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

  const handleReset = () => {
    setContent("Your text here. Start typing to see it come to life!")
    setAuthor("")
    setBackgroundType("gradient")
    setGradient(gradientPresets[0].value)
    setFontFamily("Inter")
    setFontWeight(700)
    setFontSize(32)
    setTextColor("#ffffff")
    setTextAlign("center")
    setPadding(40)
    setBorderColor("")
    setBorderWidth(0)
    setAccentColor("")
    setBackgroundImage(null)
    toast.info("Editor reset to defaults")
  }

  const applyTemplate = (template: Template) => {
    if (template.isPremium && user?.plan === "free") {
      toast.error("This template requires a Premium or Pro subscription")
      return
    }

    if (template.backgroundType === "gradient" && template.gradient) {
      setBackgroundType("gradient")
      setGradient(template.gradient)
    } else if (template.backgroundType === "solid" && template.backgroundColor) {
      setBackgroundType("solid")
      setSolidColor(template.backgroundColor)
    }

    setTextColor(template.textColor)
    setFontFamily(template.fontFamily)
    setFontWeight(template.fontWeight || 700)
    setFontSize(template.fontSize)
    setTextAlign(template.textAlign)
    setPadding(template.padding)
    setBorderColor(template.borderColor || "")
    setBorderWidth(template.borderWidth || 0)
    setAccentColor(template.accentColor || "")
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

  // Compute background for canvas based on type
  const canvasGradient =
    backgroundType === "gradient"
      ? gradient
      : backgroundType === "custom"
        ? `linear-gradient(${customGradient.angle}deg, ${customGradient.color1} 0%, ${customGradient.color2} 100%)`
        : undefined
  const canvasBackgroundColor = backgroundType === "solid" ? solidColor : undefined

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <DashboardHeader title="Manual Editor" description="Create your post with full control" />

      <div className="flex flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:flex-row">
        {/* Mobile Preview Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="mb-4 w-full gap-2 lg:hidden"
        >
          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showPreview ? 'Hide' : 'Show'} Preview
        </Button>

        {/* Mobile Preview (Sticky Top) */}
        {showPreview && (
          <div className="mb-4 lg:hidden">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Live Preview</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {platformSizes[platform].width} x {platformSizes[platform].height}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-2">
                <PreviewCanvas
                  platform={platform}
                  content={content}
                  author={author}
                  gradient={canvasGradient}
                  backgroundColor={canvasBackgroundColor}
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
                  maxHeight="35vh"
                />
              </CardContent>
            </Card>
          </div>
        )}


        {/* Left Panel - Controls (Scrollable) */}
        <ScrollArea className="flex-1 w-full min-h-0 lg:flex-none lg:w-96">
          <div className="space-y-4 pr-4">
            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-1 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
              <Select value={platform} onValueChange={(v) => setPlatform(v as PlatformKey)}>
                <SelectTrigger className="flex-1">
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

            {/* Content */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Type className="h-4 w-4" />
                  Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Main Text</Label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    placeholder="Enter your post content..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Author / Credit (optional)</Label>
                  <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your name or brand" />
                </div>
              </CardContent>
            </Card>

            {/* Background */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Droplet className="h-4 w-4" />
                  Background
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={backgroundType}
                  onValueChange={(v) => {
                    if (v === "custom" && !canUseCustomBackground) {
                      toast.error("Custom backgrounds require a Premium or Pro subscription")
                      return
                    }
                    setBackgroundType(v as typeof backgroundType)
                  }}
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="gradient">Gradient</TabsTrigger>
                    <TabsTrigger value="solid">Solid</TabsTrigger>
                    <TabsTrigger value="custom" className="relative">
                      Custom
                      {!canUseCustomBackground && <Lock className="h-3 w-3 ml-1 text-muted-foreground" />}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="gradient" className="mt-4">
                    <div className="grid grid-cols-4 gap-2">
                      {gradientPresets.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => setGradient(preset.value)}
                          className={`aspect-square rounded-lg transition-all ${gradient === preset.value ? "ring-2 ring-primary ring-offset-2" : ""
                            }`}
                          style={{ background: preset.value }}
                          title={preset.name}
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="solid" className="mt-4">
                    <div className="grid grid-cols-6 gap-2">
                      {solidColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSolidColor(color.value)}
                          className={`aspect-square rounded-lg border transition-all ${solidColor === color.value ? "ring-2 ring-primary ring-offset-2" : ""
                            }`}
                          style={{ background: color.value }}
                        />
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <input
                        type="color"
                        value={solidColor}
                        onChange={(e) => setSolidColor(e.target.value)}
                        className="h-10 w-10 cursor-pointer rounded"
                      />
                      <Input value={solidColor} onChange={(e) => setSolidColor(e.target.value)} className="flex-1" />
                    </div>
                  </TabsContent>

                  <TabsContent value="custom" className="mt-4 space-y-4">
                    {canUseCustomBackground ? (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Color 1</Label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={customGradient.color1}
                                onChange={(e) => setCustomGradient({ ...customGradient, color1: e.target.value })}
                                className="h-10 w-10 cursor-pointer rounded"
                              />
                              <Input
                                value={customGradient.color1}
                                onChange={(e) => setCustomGradient({ ...customGradient, color1: e.target.value })}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Color 2</Label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={customGradient.color2}
                                onChange={(e) => setCustomGradient({ ...customGradient, color2: e.target.value })}
                                className="h-10 w-10 cursor-pointer rounded"
                              />
                              <Input
                                value={customGradient.color2}
                                onChange={(e) => setCustomGradient({ ...customGradient, color2: e.target.value })}
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Angle: {customGradient.angle}°</Label>
                          <Slider
                            value={[customGradient.angle]}
                            onValueChange={([v]) => setCustomGradient({ ...customGradient, angle: v })}
                            min={0}
                            max={360}
                            step={15}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-3">
                          Upgrade to Premium or Pro to create custom gradients
                        </p>
                        <Button size="sm" onClick={() => (window.location.href = "/credits")}>
                          <Crown className="h-4 w-4 mr-1" />
                          Upgrade Now
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="mt-4 space-y-3 border-t pt-4">
                  <Label className="text-sm font-medium">Border (Optional)</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={borderColor || "#0FB4FF"}
                      onChange={(e) => setBorderColor(e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded"
                    />
                    <Input
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      placeholder="Border color"
                      className="flex-1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Border Width: {borderWidth}px</Label>
                    <Slider
                      value={[borderWidth]}
                      onValueChange={([v]) => setBorderWidth(v)}
                      min={0}
                      max={10}
                      step={1}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Typography */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Palette className="h-4 w-4" />
                  Typography
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font.id} value={font.value}>
                          {font.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font Size: {fontSize}px</Label>
                  <Slider value={[fontSize]} onValueChange={([v]) => setFontSize(v)} min={16} max={64} step={2} />
                </div>

                <div className="space-y-2">
                  <Label>Font Weight: {fontWeight}</Label>
                  <Select value={String(fontWeight)} onValueChange={(v) => setFontWeight(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">Light (300)</SelectItem>
                      <SelectItem value="400">Regular (400)</SelectItem>
                      <SelectItem value="500">Medium (500)</SelectItem>
                      <SelectItem value="600">Semi-Bold (600)</SelectItem>
                      <SelectItem value="700">Bold (700)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded"
                    />
                    <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="flex-1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Accent Color (Author)</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={accentColor || textColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded"
                    />
                    <Input
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      placeholder="Same as text"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Text Alignment</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={textAlign === "left" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTextAlign("left")}
                      className="flex-1"
                    >
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={textAlign === "center" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTextAlign("center")}
                      className="flex-1"
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={textAlign === "right" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTextAlign("right")}
                      className="flex-1"
                    >
                      <AlignRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Padding: {padding}px</Label>
                  <Slider value={[padding]} onValueChange={([v]) => setPadding(v)} min={20} max={80} step={5} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ImageIcon className="h-4 w-4" />
                  Background Image
                  {!canUseImages && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Pro
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {canUseImages ? (
                  <ImageUpload currentImage={backgroundImage} onImageSelect={setBackgroundImage} isPro={true} />
                ) : (
                  <div className="text-center py-6 rounded-lg border border-dashed">
                    <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Background images and AI generation require a Pro subscription
                    </p>
                    <Button size="sm" onClick={() => (window.location.href = "/credits")}>
                      <Crown className="h-4 w-4 mr-1" />
                      Upgrade to Pro
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Templates Quick Apply */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Layout className="h-4 w-4" />
                  Quick Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {templates.slice(0, 12).map((template) => (
                    <button
                      key={template.id}
                      onClick={() => applyTemplate(template)}
                      className="relative aspect-square rounded-lg p-1 text-[8px] font-medium transition-all hover:ring-2 hover:ring-primary hover:ring-offset-1"
                      style={{
                        background:
                          template.backgroundType === "gradient" ? template.gradient : template.backgroundColor,
                        color: template.textColor,
                        border: template.borderColor
                          ? `${Math.max(1, (template.borderWidth || 2) / 2)}px solid ${template.borderColor}`
                          : "none",
                      }}
                      title={template.name}
                    >
                      {template.name.split(" ")[0]}
                      {template.isPremium && <Crown className="absolute right-0.5 top-0.5 h-2 w-2 text-yellow-400" />}
                    </button>
                  ))}
                </div>
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
                  imageDataUrl=""
                  content={content}
                  platform={platform}
                />
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Desktop Preview (Right Panel - Always Visible) */}
        <div className="hidden flex-1 lg:block">
          <Card className="sticky top-6 h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Live Preview</CardTitle>
                <Badge variant="outline">
                  {platformSizes[platform].width} x {platformSizes[platform].height}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex h-[calc(100%-4rem)] items-center justify-center p-8">
              <PreviewCanvas
                platform={platform}
                content={content}
                author={author}
                gradient={canvasGradient}
                backgroundColor={canvasBackgroundColor}
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
                onExport={handleExport}
                exportTrigger={exportTrigger}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={handleAdvancedExport}
        currentPlatform={platform}
      />
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { Upload, Sparkles, ImageIcon, X, Loader2, Crown } from "lucide-react"

interface ImageUploadProps {
  onImageSelect: (imageUrl: string | null) => void
  currentImage: string | null
  isPro?: boolean
}

export function ImageUpload({ onImageSelect, currentImage, isPro = false }: ImageUploadProps) {
  const { user } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const hasProAccess = isPro || user?.plan === "pro"

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      onImageSelect(imageUrl)
      setIsOpen(false)
      toast.success("Image uploaded successfully!")
    }
    reader.readAsDataURL(file)
  }

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a description for the image")
      return
    }

    setIsGenerating(true)

    // Mock AI image generation - in production, call your AI image API
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Using placeholder with query for demo
    const generatedImageUrl = `/placeholder.svg?height=1080&width=1080&query=${encodeURIComponent(aiPrompt)}`
    onImageSelect(generatedImageUrl)
    setIsOpen(false)
    setIsGenerating(false)
    toast.success("AI image generated successfully!")
  }

  const handleRemoveImage = () => {
    onImageSelect(null)
    toast.info("Background image removed")
  }

  if (!hasProAccess) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/25 p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Crown className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Background Images</p>
            <p className="text-sm text-muted-foreground">Upload or generate images with Pro</p>
          </div>
          <Badge variant="secondary">Pro Feature</Badge>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {currentImage ? (
        <div className="relative">
          <div
            className="aspect-video w-full rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${currentImage})` }}
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-7 w-7"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-primary hover:bg-primary/5"
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm font-medium">Add Background Image</span>
          <span className="text-xs text-muted-foreground">Upload or generate with AI</span>
        </button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Background Image</DialogTitle>
            <DialogDescription>Upload your own image or generate one with AI</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="upload" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI Generate
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-4 space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center gap-3 rounded-lg border border-dashed border-muted-foreground/25 p-8 transition-colors hover:border-primary hover:bg-primary/5"
              >
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-medium">Click to upload</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </TabsContent>

            <TabsContent value="ai" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label>Describe your image</Label>
                <Input
                  placeholder="e.g., Abstract gradient background with purple and blue tones"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {["Abstract gradient", "Nature landscape", "City skyline", "Minimalist pattern"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setAiPrompt(suggestion)}
                    className="rounded-full bg-muted px-3 py-1 text-xs transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <Button onClick={handleAIGenerate} disabled={isGenerating || !aiPrompt.trim()} className="w-full gap-2">
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Image
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}

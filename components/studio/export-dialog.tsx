"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { platformSizes, type PlatformKey } from "@/lib/templates"
import { Download, ImageIcon, Loader2 } from "lucide-react"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExport: (format: "png" | "jpg", platform: PlatformKey) => void
  currentPlatform: PlatformKey
}

export function ExportDialog({ open, onOpenChange, onExport, currentPlatform }: ExportDialogProps) {
  const [format, setFormat] = useState<"png" | "jpg">("png")
  const [platform, setPlatform] = useState<PlatformKey>(currentPlatform)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onExport(format, platform)
    setIsExporting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Post
          </DialogTitle>
          <DialogDescription>Choose your export settings for the best quality</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label>File Format</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as "png" | "jpg")} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="png" id="png" />
                <Label htmlFor="png" className="cursor-pointer">
                  <span className="font-medium">PNG</span>
                  <span className="block text-xs text-muted-foreground">Best quality, transparent</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="jpg" id="jpg" />
                <Label htmlFor="jpg" className="cursor-pointer">
                  <span className="font-medium">JPG</span>
                  <span className="block text-xs text-muted-foreground">Smaller file size</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Platform Size */}
          <div className="space-y-3">
            <Label>Platform Size</Label>
            <Select value={platform} onValueChange={(v) => setPlatform(v as PlatformKey)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(platformSizes).map(([key, { label, width, height }]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center justify-between gap-4">
                      <span>{label}</span>
                      <span className="text-xs text-muted-foreground">
                        {width}x{height}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview Info */}
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">{platformSizes[platform].label}</p>
                <p className="text-sm text-muted-foreground">
                  {platformSizes[platform].width} x {platformSizes[platform].height} px • {format.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting} className="gap-2">
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

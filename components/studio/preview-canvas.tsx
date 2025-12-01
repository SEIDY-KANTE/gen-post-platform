"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { platformSizes, type PlatformKey, type Template } from "@/lib/templates"

interface PreviewCanvasProps {
  platform: PlatformKey
  content: string
  author?: string
  template?: Template
  gradient?: string
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  textColor: string
  accentColor?: string
  fontFamily: string
  fontWeight?: number
  fontSize: number
  textAlign: "left" | "center" | "right"
  padding: number
  backgroundImage?: string
  onRender?: (dataUrl: string) => void
  onExport?: (dataUrl: string) => void
  exportTrigger?: number
  maxHeight?: string
  exportEvenIfHidden?: boolean
  showWatermark?: boolean
  watermarkLabel?: string
}

const FONT_URLS: Record<string, string> = {
  Inter: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
  "Playfair Display": "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap",
  Poppins: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
  Montserrat: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap",
  Roboto: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
  Lora: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap",
  "Open Sans": "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap",
  Oswald: "https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap",
}

async function loadFont(fontFamily: string): Promise<boolean> {
  const fontUrl = FONT_URLS[fontFamily]
  if (!fontUrl) {
    return true // Use system font
  }

  // Check if link already exists, if not add it
  const existingLink = document.querySelector(`link[href="${fontUrl}"]`)
  if (!existingLink) {
    const link = document.createElement("link")
    link.href = fontUrl
    link.rel = "stylesheet"
    document.head.appendChild(link)
  }

  // Wait for the font to actually load with timeout
  return new Promise((resolve) => {
    let attempts = 0
    const maxAttempts = 50 // 5 seconds max

    const checkFont = () => {
      attempts++
      // Check multiple weights to ensure font is loaded
      const isLoaded =
        document.fonts.check(`400 16px "${fontFamily}"`) || document.fonts.check(`700 16px "${fontFamily}"`)

      if (isLoaded) {
        resolve(true)
      } else if (attempts >= maxAttempts) {
        resolve(false)
      } else {
        setTimeout(checkFont, 100)
      }
    }

    // Also use the fonts API to load
    document.fonts
      .load(`400 16px "${fontFamily}"`)
      .then(() => {
        document.fonts
          .load(`700 16px "${fontFamily}"`)
          .then(() => {
            resolve(true)
          })
          .catch(() => checkFont())
      })
      .catch(() => checkFont())
  })
}

function parseGradient(
  ctx: CanvasRenderingContext2D,
  gradientStr: string,
  width: number,
  height: number,
): CanvasGradient | string {
  const cleaned = gradientStr.trim()

  if (!cleaned.startsWith("linear-gradient")) {
    return cleaned.startsWith("#") || cleaned.startsWith("rgb") ? cleaned : "#667eea"
  }

  const startParen = cleaned.indexOf("(")
  const endParen = cleaned.lastIndexOf(")")

  if (startParen === -1 || endParen === -1) {
    return "#667eea"
  }

  const inner = cleaned.substring(startParen + 1, endParen)

  const parts: string[] = []
  let current = ""
  let parenDepth = 0

  for (const char of inner) {
    if (char === "(") parenDepth++
    if (char === ")") parenDepth--
    if (char === "," && parenDepth === 0) {
      parts.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  if (current.trim()) {
    parts.push(current.trim())
  }

  let angle = 135
  let colorStartIndex = 0

  if (parts[0] && parts[0].includes("deg")) {
    angle = Number.parseInt(parts[0].replace("deg", "").trim()) || 135
    colorStartIndex = 1
  }

  const stops: { color: string; position: number }[] = []
  const colorParts = parts.slice(colorStartIndex)

  colorParts.forEach((part, index) => {
    const colorMatch = part.match(/^(#[a-fA-F0-9]{3,8}|rgba?$$[^)]+$$|[a-z]+)/i)
    const percentMatch = part.match(/(\d+)%/)

    if (colorMatch) {
      const position = percentMatch
        ? Number.parseInt(percentMatch[1]) / 100
        : index / Math.max(colorParts.length - 1, 1)

      stops.push({
        color: colorMatch[1],
        position: Math.min(1, Math.max(0, position)),
      })
    }
  })

  if (stops.length < 2) {
    return stops[0]?.color || "#667eea"
  }

  const angleRad = ((angle - 90) * Math.PI) / 180
  const centerX = width / 2
  const centerY = height / 2
  const length = Math.sqrt(width * width + height * height) / 2

  const x1 = centerX - Math.cos(angleRad) * length
  const y1 = centerY - Math.sin(angleRad) * length
  const x2 = centerX + Math.cos(angleRad) * length
  const y2 = centerY + Math.sin(angleRad) * length

  const grad = ctx.createLinearGradient(x1, y1, x2, y2)

  stops.forEach(({ color, position }) => {
    try {
      grad.addColorStop(position, color)
    } catch (e) {
      // Invalid color, skip
    }
  })

  return grad
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const paragraphs = text.split("\n")
  const allLines: string[] = []

  paragraphs.forEach((paragraph) => {
    if (paragraph.trim() === "") {
      allLines.push("")
      return
    }

    const words = paragraph.split(" ")
    let currentLine = ""

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const metrics = ctx.measureText(testLine)

      if (metrics.width > maxWidth && currentLine) {
        allLines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    })

    if (currentLine) {
      allLines.push(currentLine)
    }
  })

  return allLines
}

export function PreviewCanvas({
  platform,
  content,
  author,
  template,
  gradient,
  backgroundColor,
  borderColor,
  borderWidth = 0,
  textColor,
  accentColor,
  fontFamily,
  fontWeight = 700,
  fontSize,
  textAlign,
  padding,
  backgroundImage,
  onRender,
  onExport,
  exportTrigger,
  maxHeight = "70vh",
  exportEvenIfHidden = false,
  showWatermark = false,
  watermarkLabel,
}: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [fontLoaded, setFontLoaded] = useState(false)
  const prevExportTrigger = useRef(exportTrigger || 0)

  const { width, height } = platformSizes[platform]
  const aspectRatio = width / height

  useEffect(() => {
    setFontLoaded(false)
    loadFont(fontFamily).then((loaded) => {
      setFontLoaded(true)
    })
  }, [fontFamily])

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    const drawWatermark = () => {
      if (!showWatermark) return

      const framePadding = Math.max(12, width * 0.035)
      const frameRadius = Math.max(10, width * 0.02)
      const frameLineWidth = Math.max(2, width * 0.0045)

      // Outer frame
      ctx.save()
      ctx.strokeStyle = "rgba(255,255,255,0.35)"
      ctx.lineWidth = frameLineWidth
      ctx.setLineDash([width * 0.025, width * 0.015])
      drawRoundedRectPath(ctx, framePadding, framePadding, width - framePadding * 2, height - framePadding * 2, frameRadius)
      ctx.stroke()
      ctx.restore()

      // Label ribbon
      const label = watermarkLabel || "GenPost Free"
      const pillFontSize = Math.max(15, width * 0.03)
      const pillPaddingX = Math.max(14, width * 0.02)
      const pillPaddingY = Math.max(8, width * 0.012)

      ctx.save()
      ctx.font = `700 ${pillFontSize}px "Inter", Arial, sans-serif`
      ctx.textBaseline = "middle"
      ctx.textAlign = "left"

      const textMetrics = ctx.measureText(label)
      const pillWidth = textMetrics.width + pillPaddingX * 2
      const pillHeight = pillFontSize + pillPaddingY * 2
      const pillX = (width - pillWidth) / 2
      const pillY = height - framePadding - pillHeight
      const pillRadius = pillHeight / 2

      const ribbon = ctx.createLinearGradient(pillX, pillY, pillX + pillWidth, pillY + pillHeight)
      ribbon.addColorStop(0, "rgba(15,23,42,0.82)")
      ribbon.addColorStop(1, "rgba(14,165,233,0.88)")

      ctx.fillStyle = ribbon
      drawRoundedRectPath(ctx, pillX, pillY, pillWidth, pillHeight, pillRadius)
      ctx.fill()

      ctx.fillStyle = "rgba(255,255,255,0.92)"
      const textY = pillY + pillHeight / 2
      ctx.fillText(label, pillX + pillPaddingX, textY)
      ctx.restore()
    }

    const drawContent = () => {
      ctx.clearRect(0, 0, width, height)

      if (backgroundColor && backgroundColor !== "") {
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, width, height)
      } else if (gradient && gradient !== "") {
        const gradientFill = parseGradient(ctx, gradient, width, height)
        ctx.fillStyle = gradientFill
        ctx.fillRect(0, 0, width, height)
      } else {
        ctx.fillStyle = "#667eea"
        ctx.fillRect(0, 0, width, height)
      }

      if (borderColor && borderWidth > 0) {
        const scaledBorderWidth = borderWidth * (width / 400)
        ctx.strokeStyle = borderColor
        ctx.lineWidth = scaledBorderWidth
        ctx.strokeRect(
          scaledBorderWidth / 2,
          scaledBorderWidth / 2,
          width - scaledBorderWidth,
          height - scaledBorderWidth,
        )
      }

      ctx.fillStyle = textColor
      ctx.textAlign = textAlign
      ctx.textBaseline = "middle"

      const scaledFontSize = fontSize * (width / 400)
      const fontString = `${fontWeight} ${scaledFontSize}px "${fontFamily}", Arial, sans-serif`
      ctx.font = fontString

      const effectivePadding = padding * (width / 400)
      const borderOffset = borderWidth > 0 ? borderWidth * (width / 400) * 2 : 0
      const maxWidth = width - effectivePadding * 2 - borderOffset
      const lines = wrapText(ctx, content, maxWidth)

      const lineHeight = scaledFontSize * 1.4
      const totalHeight = lines.length * lineHeight
      const authorSpace = author ? scaledFontSize * 0.5 * 2.5 : 0
      const startY = (height - totalHeight - authorSpace) / 2 + lineHeight / 2

      const x =
        textAlign === "left"
          ? effectivePadding + borderOffset / 2
          : textAlign === "right"
            ? width - effectivePadding - borderOffset / 2
            : width / 2

      lines.forEach((line, i) => {
        ctx.fillText(line, x, startY + i * lineHeight)
      })

      if (author) {
        const authorFontSize = scaledFontSize * 0.5
        ctx.font = `400 ${authorFontSize}px "${fontFamily}", Arial, sans-serif`
        ctx.fillStyle = accentColor || textColor + "cc"
        ctx.fillText(`— ${author}`, x, startY + lines.length * lineHeight + authorFontSize * 1.5)
      }

      drawWatermark()
    }

    const finalize = () => {
      if (onRender && canvasRef.current) {
        try {
          onRender(canvasRef.current.toDataURL("image/png"))
        } catch {
          // ignore
        }
      }
    }

    if (backgroundImage) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const imgAspect = img.width / img.height
        const canvasAspect = width / height
        let drawWidth, drawHeight, drawX, drawY

        if (imgAspect > canvasAspect) {
          drawHeight = height
          drawWidth = height * imgAspect
          drawX = (width - drawWidth) / 2
          drawY = 0
        } else {
          drawWidth = width
          drawHeight = width / imgAspect
          drawX = 0
          drawY = (height - drawHeight) / 2
        }

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)"
        ctx.fillRect(0, 0, width, height)

        ctx.fillStyle = textColor
        ctx.textAlign = textAlign
        ctx.textBaseline = "middle"

        const scaledFontSize = fontSize * (width / 400)
        ctx.font = `${fontWeight} ${scaledFontSize}px "${fontFamily}", Arial, sans-serif`

        const effectivePadding = padding * (width / 400)
        const maxWidth = width - effectivePadding * 2
        const lines = wrapText(ctx, content, maxWidth)

        const lineHeight = scaledFontSize * 1.4
        const totalHeight = lines.length * lineHeight
        const startY = (height - totalHeight) / 2 + lineHeight / 2

        const x = textAlign === "left" ? effectivePadding : textAlign === "right" ? width - effectivePadding : width / 2

        lines.forEach((line, i) => {
          ctx.fillText(line, x, startY + i * lineHeight)
        })

        if (author) {
          const authorFontSize = scaledFontSize * 0.5
          ctx.font = `400 ${authorFontSize}px "${fontFamily}", Arial, sans-serif`
          ctx.fillStyle = accentColor || textColor + "cc"
          ctx.fillText(`— ${author}`, x, startY + lines.length * lineHeight + authorFontSize * 1.5)
        }
        drawWatermark()
        finalize()
      }
      img.src = backgroundImage
    } else {
      drawContent()
      finalize()
    }
  }, [
    platform,
    content,
    author,
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
    onRender,
    showWatermark,
    watermarkLabel,
    width,
    height,
  ])

  // Draw canvas when dependencies change AND font is loaded
  useEffect(() => {
    if (fontLoaded) {
      drawCanvas()
    }
  }, [fontLoaded, drawCanvas])

  useEffect(() => {
    // Only export if trigger increased AND we haven't exported this trigger value yet
    const trigger = exportTrigger || 0
    if (trigger > 0 && trigger > prevExportTrigger.current && canvasRef.current && onExport) {
      // Skip export if the canvas is currently hidden (e.g., alternate layout)
      const isVisible =
        !!containerRef.current &&
        containerRef.current.getClientRects().length > 0 &&
        containerRef.current.offsetParent !== null
      if (!isVisible && !exportEvenIfHidden) return

      prevExportTrigger.current = trigger

      // Wait a bit for canvas to be fully rendered
      const timer = setTimeout(() => {
        if (canvasRef.current) {
          const dataUrl = canvasRef.current.toDataURL("image/png")
          // Call the callback for saving to history
          onExport(dataUrl)
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [exportTrigger, onExport, exportEvenIfHidden])

  return (
    <div ref={containerRef} className="relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: "100%",
          maxHeight: maxHeight,
          width: aspectRatio > 1 ? "100%" : "auto",
          height: aspectRatio <= 1 ? "100%" : "auto",
          borderRadius: "0.5rem",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  )
}

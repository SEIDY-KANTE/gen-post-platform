"use client"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Instagram, Linkedin, Twitter, Facebook, Share2, Copy } from "lucide-react"

interface ShareButtonsProps {
    imageDataUrl: string
    content: string
    platform: string
    onDownload: () => void
}

export function ShareButtons({ imageDataUrl, content, platform, onDownload }: ShareButtonsProps) {
    const canShare = typeof navigator !== 'undefined' && navigator.share

    const shareToInstagram = async () => {
        // Instagram doesn't support direct web sharing
        // Download image and copy caption to clipboard
        onDownload()

        try {
            await navigator.clipboard.writeText(content)
            toast.success("Image downloaded! Caption copied to clipboard. Open Instagram to share.")
        } catch (error) {
            toast.success("Image downloaded! Open Instagram and paste your caption.")
        }
    }

    const shareViaWebShare = async (platformName: string) => {
        if (!canShare) {
            onDownload()
            toast.info(`Download complete! Open ${platformName} to share.`)
            return
        }

        try {
            // Convert data URL to blob
            const response = await fetch(imageDataUrl)
            const blob = await response.blob()
            const file = new File([blob], `genpost-${platform}.png`, { type: 'image/png' })

            await navigator.share({
                files: [file],
                title: 'GenPost',
                text: content,
            })

            toast.success(`Shared to ${platformName}!`)
        } catch (error) {
            // User cancelled or error occurred
            if ((error as Error).name !== 'AbortError') {
                onDownload()
                toast.info(`Download complete! Open ${platformName} to share.`)
            }
        }
    }

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(content)
            toast.success("Caption copied to clipboard!")
        } catch (error) {
            toast.error("Failed to copy to clipboard")
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">Share to:</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={shareToInstagram}
                    className="gap-2"
                >
                    <Instagram className="h-4 w-4" />
                    Instagram
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareViaWebShare('LinkedIn')}
                    className="gap-2"
                >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareViaWebShare('Twitter')}
                    className="gap-2"
                >
                    <Twitter className="h-4 w-4" />
                    Twitter
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareViaWebShare('Facebook')}
                    className="gap-2"
                >
                    <Facebook className="h-4 w-4" />
                    Facebook
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={copyLink}
                    className="gap-2"
                >
                    <Copy className="h-4 w-4" />
                    Copy Text
                </Button>

                {canShare && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareViaWebShare('Other')}
                        className="gap-2"
                    >
                        <Share2 className="h-4 w-4" />
                        More
                    </Button>
                )}
            </div>
        </div>
    )
}

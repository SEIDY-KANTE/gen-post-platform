"use client"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { MessageCircle, Linkedin, Twitter, Facebook, Share2, Copy } from "lucide-react"

interface ShareButtonsProps {
    imageDataUrl: string
    content: string
    platform: string
    onDownload?: () => void
}

export function ShareButtons({ imageDataUrl, content, platform, onDownload }: ShareButtonsProps) {
    const canShare = typeof navigator !== 'undefined' && navigator.share

    // Download image helper
    const downloadImage = () => {
        if (onDownload) {
            onDownload()
        } else {
            // Fallback: create download link
            const link = document.createElement("a")
            link.download = `genpost-${platform}-${Date.now()}.png`
            link.href = imageDataUrl
            link.click()
        }
    }

    const shareToWhatsApp = async () => {
        // WhatsApp works great with Web Share API on mobile
        if (canShare) {
            try {
                const response = await fetch(imageDataUrl)
                const blob = await response.blob()
                const file = new File([blob], `genpost-${platform}.png`, { type: 'image/png' })

                await navigator.share({
                    files: [file],
                    text: content,
                })

                toast.success("Shared to WhatsApp!")
                return
            } catch (error) {
                if ((error as Error).name === 'AbortError') {
                    return
                }
                // Fallback if share fails
            }
        }

        // Fallback: Download and open WhatsApp Web
        downloadImage()
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(content)}`
        window.open(whatsappUrl, '_blank')
        toast.info("Image downloaded! Attach it to your WhatsApp message.")
    }

    const shareToFacebook = () => {
        // Facebook doesn't support image upload via Web Share API reliably
        // Just download and open Facebook
        downloadImage()
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(content)}`
        window.open(facebookUrl, '_blank', 'width=600,height=400')
        toast.info("Image downloaded! Upload it manually to your Facebook post.")
    }

    const shareToLinkedIn = () => {
        // LinkedIn doesn't support image upload via Web Share API
        // Just download and open LinkedIn
        downloadImage()
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
        window.open(linkedInUrl, '_blank', 'width=600,height=600')
        toast.info("Image downloaded! Add it manually to your LinkedIn post.")
    }

    const shareToTwitter = () => {
        // Twitter doesn't support image upload via Web Share API
        // Just download and open Twitter
        downloadImage()
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`
        window.open(twitterUrl, '_blank', 'width=600,height=400')
        toast.info("Image downloaded! Attach it to your tweet.")
    }

    const shareViaWebShare = async () => {
        if (!canShare) {
            downloadImage()
            toast.info("Download complete! Share from your device.")
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

            toast.success("Shared successfully!")
        } catch (error) {
            // User cancelled or error occurred
            if ((error as Error).name !== 'AbortError') {
                downloadImage()
                toast.info("Download complete! Share from your device.")
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
                    onClick={shareToWhatsApp}
                    className="gap-2"
                >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={shareToLinkedIn}
                    className="gap-2"
                >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={shareToTwitter}
                    className="gap-2"
                >
                    <Twitter className="h-4 w-4" />
                    Twitter
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={shareToFacebook}
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
                        onClick={shareViaWebShare}
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

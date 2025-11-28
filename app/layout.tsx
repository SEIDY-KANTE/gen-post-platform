import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GenPost - AI-Powered Social Media Post Generator",
  description:
    "Create stunning social media posts with AI. Generate beautiful quote images, marketing content, and more.",
  icons: {
    icon: "/sparkles.svg",
  },
  keywords: ["GenPost", "AI", "Social Media", "Post Generator"],
  authors: [
    {
      name: "GenPost",
      url: "https://genpost-ai.vercel.app/",
    },
  ],
  openGraph: {
    title: "GenPost - AI-Powered Social Media Post Generator",
    description:
      "Create stunning social media posts with AI. Generate beautiful quote images, marketing content, and more.",
    images: [
      {
        url: "/sparkles.png",
        width: 800,
        height: 600,
        alt: "GenPost - AI-Powered Social Media Post Generator",
        type: "image/png",
      },
    ],    
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Sora, Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { I18nProvider } from "@/lib/i18n"
import "./globals.css"

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" })
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" })

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
      <body className={`${sora.variable} ${manrope.variable} font-sans antialiased`}>
        <I18nProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
          <Analytics />
        </I18nProvider>
      </body>
    </html>
  )
}

import { LandingHeader } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero"
import { FeaturesSection } from "@/components/landing/features"
import { TemplatesPreview } from "@/components/landing/templates-preview"
import { PricingSection } from "@/components/landing/pricing"
import { Footer } from "@/components/landing/footer"
import { TrustBand } from "@/components/landing/trust"
import { FaqSection } from "@/components/landing/faq"
import { CtaBand } from "@/components/landing/cta-band"
import { MobileCta } from "@/components/landing/mobile-cta"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <main>
        <HeroSection />
        <TrustBand />
        <FeaturesSection />
        <TemplatesPreview />
        <PricingSection />
        <CtaBand />
        <FaqSection />
      </main>
      <MobileCta />
      <Footer />
    </div>
  )
}

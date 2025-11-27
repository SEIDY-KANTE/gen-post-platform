import { LandingHeader } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero"
import { FeaturesSection } from "@/components/landing/features"
import { TemplatesPreview } from "@/components/landing/templates-preview"
import { PricingSection } from "@/components/landing/pricing"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TemplatesPreview />
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}

import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">GenPost</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-4 text-muted-foreground">Last updated: November 27, 2025</p>

        <div className="mt-12 space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p className="mt-3 leading-relaxed">
              By accessing or using GenPost, you agree to be bound by these Terms of Service. If you do not agree to
              these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
            <p className="mt-3 leading-relaxed">
              GenPost provides an AI-powered platform for creating social media posts, including quote images, marketing
              content, and other visual materials. Our service includes both free and premium features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. User Accounts</h2>
            <p className="mt-3 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities
              that occur under your account. You must notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Credits and Payments</h2>
            <p className="mt-3 leading-relaxed">
              GenPost operates on a credit-based system. Credits are required for AI-generated content. Purchased
              credits are non-refundable and expire after 12 months. Subscription plans auto-renew unless cancelled.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Acceptable Use</h2>
            <p className="mt-3 leading-relaxed">
              You agree not to use GenPost to create content that is illegal, harmful, threatening, abusive, defamatory,
              or otherwise objectionable. We reserve the right to suspend or terminate accounts that violate these
              guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Intellectual Property</h2>
            <p className="mt-3 leading-relaxed">
              Content you create using GenPost belongs to you. However, by using our service, you grant us a license to
              use anonymized versions of your content to improve our AI models and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Limitation of Liability</h2>
            <p className="mt-3 leading-relaxed">
              GenPost is provided "as is" without warranties of any kind. We shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages resulting from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Modifications</h2>
            <p className="mt-3 leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the service after changes
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Contact</h2>
            <p className="mt-3 leading-relaxed">
              For questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:legal@genpost.app" className="text-primary hover:underline">
                legal@genpost.app
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}

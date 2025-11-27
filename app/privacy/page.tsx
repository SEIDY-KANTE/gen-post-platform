import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">Last updated: November 27, 2025</p>

        <div className="mt-12 space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p className="mt-3 leading-relaxed">
              We collect information you provide directly to us, such as when you create an account, use our services,
              or contact us for support. This may include your name, email address, and any content you create using
              GenPost.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p className="mt-3 leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, process transactions,
              send you technical notices and support messages, and respond to your comments and questions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Information Sharing</h2>
            <p className="mt-3 leading-relaxed">
              We do not share your personal information with third parties except as described in this policy. We may
              share information with vendors and service providers who need access to such information to carry out work
              on our behalf.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Data Security</h2>
            <p className="mt-3 leading-relaxed">
              We take reasonable measures to help protect your personal information from loss, theft, misuse,
              unauthorized access, disclosure, alteration, and destruction. However, no security system is impenetrable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Your Rights</h2>
            <p className="mt-3 leading-relaxed">
              You may access, update, or delete your account information at any time by logging into your account
              settings. You may also contact us to request access to, correction of, or deletion of any personal
              information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Cookies</h2>
            <p className="mt-3 leading-relaxed">
              We use cookies and similar tracking technologies to collect information about your browsing activities and
              to distinguish you from other users. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Changes to This Policy</h2>
            <p className="mt-3 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new
              policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Contact Us</h2>
            <p className="mt-3 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@genpost.app" className="text-primary hover:underline">
                privacy@genpost.app
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}

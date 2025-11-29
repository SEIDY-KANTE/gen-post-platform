"use client"

import { useI18n } from "@/lib/i18n"

const faqKeys = ["faq.q1", "faq.q2", "faq.q3", "faq.q4"] as const
const faqAnswerKeys = ["faq.a1", "faq.a2", "faq.a3", "faq.a4"] as const


export function FaqSection() {
  const { t } = useI18n()
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{t("faq.title", "FAQ")}</p>
          <h3 className="mt-2 text-3xl font-semibold">{t("faq.title", "FAQ")}</h3>
          <p className="mt-2 text-muted-foreground">{t("faq.subtitle", "Clarity on limits, exports and support.")}</p>
        </div>
        <div className="mt-10 grid gap-4">
          {faqKeys.map((key, idx) => (
            <details
              key={key}
              className="group rounded-2xl border border-border/70 bg-card/80 p-5 transition hover:border-primary/50"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left text-lg font-semibold">
                <span>{t(key)}</span>
                <span className="text-primary transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{t(faqAnswerKeys[idx])}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

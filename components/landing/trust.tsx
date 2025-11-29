"use client"

import { useI18n } from "@/lib/i18n"

export function TrustBand() {
  const brands = ["Artefy", "Nova Studio", "Boldly", "Flux Media", "LinearWave", "Noon Agency"]
  const { t } = useI18n()

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl rounded-3xl border border-border/70 bg-card/70 px-5 py-6 shadow-lg shadow-primary/5 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t("trustband.title", "Ils designent avec GenPost")}</p>
            <p className="text-sm text-muted-foreground">{t("trustband.subtitle", "Studios, agences et créateurs qui publient chaque jour.")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            {brands.map((brand) => (
              <span
                key={brand}
                className="rounded-full border border-border/70 bg-card/80 px-3 py-2 text-xs font-semibold text-foreground/80"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

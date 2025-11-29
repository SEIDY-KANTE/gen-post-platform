import { useI18n, type Locale } from "@/lib/i18n"

const options: { value: Locale; label: string }[] = [
  { value: "fr", label: "FR" },
  { value: "en", label: "EN" },
]

export function LocaleSwitcher({ condensed = false }: { condensed?: boolean }) {
  const { locale, setLocale } = useI18n()

  return (
    <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-2 py-1 text-xs font-semibold">
      {!condensed && <span className="text-muted-foreground">Lang</span>}
      <div className="flex overflow-hidden rounded-full border border-border/60">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setLocale(opt.value)}
            className={`px-2 py-1 transition ${
              locale === opt.value ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:bg-card"
            }`}
            aria-label={`Switch to ${opt.label}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

import { Sparkles, Palette, Layout, Send, Wand2, Smartphone, Instagram, Facebook, Linkedin, Twitter } from "lucide-react"

const pillars = [
  {
    icon: Sparkles,
    title: "Créer en un prompt",
    tag: "AI Studio",
    description: "Brief multilingue, ton et voix respectés. Textes générés et adaptés à chaque réseau.",
    bullets: ["Suggestions auto de visuels", "Scripts courts pour TikTok/Reels", "Hashtags optimisés par audience"],
  },
  {
    icon: Palette,
    title: "Personnaliser en 30s",
    tag: "Visual editor",
    description: "Glisser-déposer, grilles fluides, palettes et typos mémorisées pour ta marque.",
    bullets: ["Palettes synchronisées", "Variantes motion prêtes en 1 clic", "Fond AI: gradients, motifs, photos"],
  },
  {
    icon: Send,
    title: "Publier partout",
    tag: "Resize & export",
    description: "Exports PNG/MP4, ratio auto, safe zones vérifiées. Handoff parfait pour tes réseaux.",
    bullets: ["Exports IG, TikTok, LinkedIn, X", "4K et webp léger", "Planification via pack social"],
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Tout le flux créatif,
            <span className="block text-gradient">du brief à la mise en ligne.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Un studio complet: génération, édition, export multi-réseaux.</p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-lg shadow-primary/5 transition-transform duration-300 hover:-translate-y-1 hover:border-primary/50"
            >
              <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-60" />
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <pillar.icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-secondary/30 px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  {pillar.tag}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
              </div>
              <div className="space-y-2">
                {pillar.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary/80" />
                    <span className="text-muted-foreground">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid items-center gap-8 rounded-3xl border border-border/60 bg-card/70 px-6 py-6 sm:grid-cols-[1.2fr,1fr] sm:px-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-primary">Optimisé par plateforme</p>
            <h3 className="text-2xl font-semibold">Safe zones, ratios et textes adaptés automatiquement.</h3>
            <p className="text-sm text-muted-foreground">
              Un clic pour décliner votre visuel pour IG, TikTok, LinkedIn et X. On ajuste la typographie, le recadrage et la durée motion pour rester lisible.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
            {[Instagram, Facebook, Linkedin, Twitter, Layout, Smartphone, Wand2].map((Icon, idx) => (
              <div
                key={idx}
                className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/60 bg-card/80 text-foreground/70 transition hover:border-primary/50 hover:text-primary"
              >
                <Icon className="h-6 w-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

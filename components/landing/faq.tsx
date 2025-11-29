const faqs = [
  {
    q: "Puis-je utiliser mes propres polices et palettes ?",
    a: "Oui, importez vos typos, couleurs et logos. Le brand kit est appliqué automatiquement à chaque génération.",
  },
  {
    q: "Les exports sont-ils prêts pour Instagram et TikTok ?",
    a: "Les ratios sont ajustés, les safe zones sont vérifiées et vous pouvez exporter en PNG, JPG ou MP4 selon le réseau.",
  },
  {
    q: "Y a-t-il une limite d'équipe ?",
    a: "Le plan Pro inclut le partage de projets, l'historique des versions et les permissions par rôle.",
  },
  {
    q: "Proposez-vous des templates motion ?",
    a: "Oui, des séries motion sont mises à jour chaque semaine avec des transitions adaptées aux Reels et TikTok.",
  },
]

export function FaqSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">FAQ</p>
          <h3 className="mt-2 text-3xl font-semibold">Questions fréquentes</h3>
          <p className="mt-2 text-muted-foreground">Transparence sur les limites, exports et support.</p>
        </div>
        <div className="mt-10 grid gap-4">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-border/70 bg-card/80 p-5 transition hover:border-primary/50"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left text-lg font-semibold">
                <span>{item.q}</span>
                <span className="text-primary transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

import {
  Sparkles,
  Palette,
  Layout,
  Download,
  Layers,
  Wand2,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Describe your vision and let AI create stunning designs with optimized text for each platform.",
  },
  {
    icon: Palette,
    title: "Visual Editor Studio",
    description:
      "Fine-tune every detail with our intuitive drag-and-drop editor. Full control over fonts, colors, and layouts.",
  },
  {
    icon: Layout,
    title: "Smart Templates",
    description: "Start with professionally designed templates for quotes, marketing, educational content, and more.",
  },
  {
    icon: Layers,
    title: "Multi-Platform Support",
    description: "Create once, export for all platforms. Automatic resizing for Instagram, TikTok, LinkedIn, and more.",
  },
  {
    icon: Wand2,
    title: "Background Generator",
    description:
      "Generate beautiful backgrounds with AI - gradients, patterns, or custom images that match your brand.",
  },
  {
    icon: Download,
    title: "High-Quality Export",
    description:
      "Download in PNG or JPG with perfect resolution. Server-side rendering for crisp, professional results.",
  },
]

const platforms = [
  { icon: Instagram, name: "Instagram" },
  { icon: Facebook, name: "Facebook" },
  { icon: Linkedin, name: "LinkedIn" },
  { icon: Twitter, name: "X/Twitter" },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to create
            <span className="block text-primary">viral social content</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From AI generation to pixel-perfect exports, GenPost has all the tools you need.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border/50 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Platform support */}
        <div className="mt-20 text-center">
          <p className="text-sm font-medium text-muted-foreground">Optimized exports for all major platforms</p>
          <div className="mt-6 flex items-center justify-center gap-8">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <platform.icon className="h-8 w-8" />
                <span className="text-xs font-medium">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

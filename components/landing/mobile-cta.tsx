import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function MobileCta() {
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 sm:hidden">
      <div className="rounded-2xl border border-primary/40 bg-card/90 px-4 py-3 shadow-lg shadow-primary/20 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Prêt ?</p>
            <p className="text-sm font-semibold">Lancer un design en 15s</p>
          </div>
          <Link href="/login" className="shrink-0">
            <Button size="sm" className="rounded-full px-3 py-2">
              Go <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

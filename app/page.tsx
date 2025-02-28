import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <nav className="flex flex-1 items-center justify-end space-x-4">
            <Link href="/home" className="text-sm font-medium hover:underline">
              Dashboard
            </Link>
            <Link href="/lebenseinkommen" className="text-sm font-medium hover:underline">
              Lebenseinkommen
            </Link>
            <Link href="/tax-scenarios" className="text-sm font-medium hover:underline">
              Steuerszenarien
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-zinc-900 to-zinc-800 text-zinc-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Gemeinsam für ein gerechtes Steuersystem
                  </h1>
                  <p className="max-w-[600px] text-zinc-200 md:text-xl">
                    Verstehen Sie die Auswirkungen von Steuern auf unsere Gesellschaft. Gestalten Sie mit uns die
                    Zukunft unseres Steuersystems.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100">
                    <Link href="/home">
                      Dashboard öffnen
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white bg-transparent hover:text-pink-500">
                    <Link href="/lebenseinkommen">Lebenseinkommen berechnen</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-[400px] aspect-square relative">
                  {/* <Image
                    src="/placeholder.svg?height=400&width=400"
                    alt="Tax visualization"
                    className="rounded-lg object-cover"
                    width={400}
                    height={400}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-zinc-500">© 2025 Unsere Steuern. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  )
}


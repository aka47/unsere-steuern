import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BarChart3, Building, Calculator, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          {/* <Link href="/" className="flex items-center space-x-2">
            <ChartPieIcon className="h-6 w-6" />
            <span className="font-bold">Unsere Steuern</span>
          </Link> */}
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
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-zinc-800">
                    <Link href="/lebenseinkommen">Lebenseinkommen berechnen</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-[400px] aspect-square relative">
                  <Image
                    src="/placeholder.svg?height=400&width=400"
                    alt="Tax visualization"
                    className="rounded-lg object-cover"
                    width={400}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Unsere Mission</h2>
                <p className="max-w-[900px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Wir machen das deutsche Steuersystem transparent und verständlich. Gemeinsam können wir ein System
                  gestalten, das allen Bürgern hilft, Vermögen aufzubauen.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="relative overflow-hidden">
                <CardContent className="flex flex-col items-center gap-2 p-6">
                  <Calculator className="h-12 w-12" />
                  <h3 className="text-xl font-bold">Steuerrechner</h3>
                  <p className="text-sm text-zinc-500 text-center">
                    Berechnen Sie Ihre persönliche Steuerbelastung und verstehen Sie die Auswirkungen.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden">
                <CardContent className="flex flex-col items-center gap-2 p-6">
                  <BarChart3 className="h-12 w-12" />
                  <h3 className="text-xl font-bold">Visualisierungen</h3>
                  <p className="text-sm text-zinc-500 text-center">
                    Interaktive Grafiken zeigen die Verteilung und Verwendung von Steuergeldern.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden">
                <CardContent className="flex flex-col items-center gap-2 p-6">
                  <Users className="h-12 w-12" />
                  <h3 className="text-xl font-bold">Gemeinschaft</h3>
                  <p className="text-sm text-zinc-500 text-center">
                    Diskutieren Sie mit anderen Bürgern über Steuerreformen und deren Auswirkungen.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-zinc-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Fakten & Zahlen</h2>
                <p className="max-w-[900px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Aktuelle Statistiken zum deutschen Steuersystem
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-4">
              <Card>
                <CardContent className="flex flex-col items-center gap-2 p-6">
                  <p className="text-3xl font-bold">906,8</p>
                  <p className="text-sm text-zinc-500">Mrd. € Steueraufkommen</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center gap-2 p-6">
                  <p className="text-3xl font-bold">42,3%</p>
                  <p className="text-sm text-zinc-500">Durchschnittliche Steuerbelastung</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center gap-2 p-6">
                  <p className="text-3xl font-bold">0,297</p>
                  <p className="text-sm text-zinc-500">Gini-Koeffizient</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center gap-2 p-6">
                  <p className="text-3xl font-bold">43,9M</p>
                  <p className="text-sm text-zinc-500">Steuerzahler</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex items-center justify-center">
                <div className="w-full max-w-[400px] aspect-square relative">
                  <Image
                    src="/placeholder.svg?height=400&width=400"
                    alt="Community visualization"
                    className="rounded-lg object-cover"
                    width={400}
                    height={400}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                    Gemeinsam für eine gerechte Zukunft
                  </h2>
                  <p className="max-w-[600px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Unsere Plattform bietet:
                  </p>
                </div>
                <ul className="grid gap-6">
                  <li className="flex items-center gap-4">
                    <Building className="h-8 w-8" />
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Transparenz</h3>
                      <p className="text-zinc-500">Klare Visualisierung der Einnahmen, Vermögen und Steuern</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-4">
                    <Calculator className="h-8 w-8" />
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Personalisierte Analyse</h3>
                      <p className="text-zinc-500">Berechnen Sie Ihre individuelle Steuerbelastung</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-4">
                    <Users className="h-8 w-8" />
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Gerechte Steuerpolitik</h3>
                      <p className="text-zinc-500">Verstehen sie wer wie viel Steuern zahlt. Verstehen sie was unsere Steuerausnahmen für eine Gruppe, für andere Gruppen an kosten bedeuten.</p>
                    </div>
                  </li>
                </ul>
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


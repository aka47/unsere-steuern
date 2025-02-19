"use client"

import { ChevronLeft, ChevronRight, Filter, Search, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaxMetrics } from "@/components/tax-metrics"
import { TaxScenarioChart } from "@/components/tax-scenario-chart"
import { TaxTable } from "@/components/tax-table"
import  Lifetime  from "@/components/lifetime"

export function DashboardShell() {
  return (
    <div className="flex flex-col bg-zinc-50/40">
      <div className="sticky top-0 z-10 flex h-14 lg:h-[60px] items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="hover:bg-zinc-100">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="hover:bg-zinc-100">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                type="search"
                placeholder="Suchen..."
                className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 border-zinc-200 focus:border-zinc-400 focus:ring-zinc-400"
              />
            </div>
          </form>
        </div>
        <Button variant="outline" size="icon" className="hover:bg-zinc-100">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Willkommen bei Wir Steuern</h2>
            <p className="text-zinc-600">
              Steuern zu erheben ist eines der zentralen Privilegien des Staates. Mithilfe dieser können wir unser Land in eine bessere Zukunft steuern. Dazu laden wir jeden Bürger ein unsere Steuern, damit unser Einkommen und Vermögen besser zu verstehen. Nicht als Erzählung, sondern in Zahlen.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-zinc-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Lebenseinkommen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600">
                  Berechnen Sie die Entwicklung Ihres Vermögens über Ihr gesamtes Arbeitsleben unter Berücksichtigung von Steuern. Für ihr eigenes Lebensvermögen und für andere Mitbürger anhand von Personas.
                </p>
              </CardContent>
            </Card>
            <Card className="border-zinc-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Einkommens, Vermögens und Steuerverteilung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600">
                  Erfahren Sie, wie sich die Steuerlast, Einkommen und Vermögen auf verschiedene Bevölkerungsgruppen verteilt. Wer trägt wie viel der Steuerlast, wie gerecht ist die Verteilung und wie genau sieht diese Verteilung in Zahlen aus?
                </p>
              </CardContent>
            </Card>
            <Card className="border-zinc-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Steuerszenarien</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600">
                  Was passiert, wenn wir die Steuern erhöhen oder senken? Vergleichen Sie verschiedene Steuermodelle und ihre Auswirkungen auf unterschiedliche Einkommensgruppen, und die Entwiclung von Wohlstand und Eigentum für die Mehrheit der Menschen in unserem Land.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Steuerszenarien-Analyse</h1>
            <p className="text-sm text-zinc-500">Vergleichen Sie verschiedene Steuermodelle und ihre Auswirkungen</p>
          </div>
          <Button variant="outline" size="icon" className="hover:bg-zinc-100">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <TaxMetrics />
        <Tabs defaultValue="all" className="space-y-4">
          <div className="border-b">
            <TabsList className="h-10 w-full justify-start rounded-none bg-transparent p-0">
              <TabsTrigger
                value="all"
                className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Alle Szenarien
              </TabsTrigger>
              <TabsTrigger
                value="flat"
                className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Flat Tax
              </TabsTrigger>
              <TabsTrigger
                value="progressive"
                className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Progressive
              </TabsTrigger>
              <TabsTrigger
                value="lifetime"
                className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Lebenseinkommen
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4 border-zinc-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Steueraufkommen im Vergleich</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <TaxScenarioChart />
                </CardContent>
              </Card>
              <Card className="lg:col-span-3 border-zinc-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Verteilungseffekte</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaxTable />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="lifetime" className="space-y-4">
            <Lifetime />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}


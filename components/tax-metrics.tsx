import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"

export function TaxMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-600">Durchschnittliche Steuerbelastung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-zinc-900">42.3%</div>
          <div className="flex items-center text-xs text-emerald-600">
            <ArrowUp className="mr-1 h-4 w-4" />
            +2.1% gegenüber Vorjahr
          </div>
        </CardContent>
      </Card>
      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-600">Steueraufkommen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-zinc-900">906.8 Mrd €</div>
          <div className="flex items-center text-xs text-emerald-600">
            <ArrowUp className="mr-1 h-4 w-4" />
            +3.4% gegenüber Vorjahr
          </div>
        </CardContent>
      </Card>
      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-600">Gini-Koeffizient</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-zinc-900">0.297</div>
          <div className="flex items-center text-xs text-rose-600">
            <ArrowDown className="mr-1 h-4 w-4" />
            -0.003 gegenüber Vorjahr
          </div>
        </CardContent>
      </Card>
      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-600">Steuerzahler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-zinc-900">43.9M</div>
          <div className="flex items-center text-xs text-emerald-600">
            <ArrowUp className="mr-1 h-4 w-4" />
            +1.2% gegenüber Vorjahr
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


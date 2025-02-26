import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const sources = [
  {
    name: "Destatis",
    description: "Statistisches Bundesamt - Einkommens- und Steuerstatistik",
    url: "https://www.destatis.de/EN/Themes/Government/Taxes/Income-Tax/_node.html",
  },
  {
    name: "Bundesministerium der Finanzen",
    description: "Steuereinnahmestatistik",
    url: "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/taxation.html",
  },
  {
    name: "DIW Berlin",
    description: "Deutsches Institut für Wirtschaftsforschung - Vermögensverteilungsstudien",
    url: "https://www.diw.de/en/diw_01.c.619420.en/research_projects/wealth_distribution_in_germany.html",
  },
]

export function DataSources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datenquellen und Annahmen</CardTitle>
        <CardDescription>Die Simulationen basieren auf folgenden Datenquellen und Annahmen</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2">
          <li>Gesamtes Lohneinkommen: ~1.100 Milliarden Euro</li>
          <li>Erbschaftsvolumen: ~400 Milliarden Euro</li>
          <li>Aktuelle Steuereinnahmen: ~242 Milliarden Euro (231 Milliarden Euro aus Löhnen, 11 Milliarden Euro aus Erbschaften)</li>
          <li>
            Die aktuellen Steuerstufen basieren auf den neuesten verfügbaren Daten des Bundesfinanzministeriums
          </li>
        </ul>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {sources.map((source) => (
            <a
              key={source.name}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <div className="flex-1">
                <div className="font-medium">{source.name}</div>
                <div className="text-sm text-muted-foreground">{source.description}</div>
              </div>
              <ExternalLink className="h-4 w-4" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


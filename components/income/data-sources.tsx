import { ExternalLink } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const sources = [
  {
    name: "Destatis",
    description: "Statistisches Bundesamt",
    url: "https://www.destatis.de",
  },
  {
    name: "DIW Berlin",
    description: "Deutsches Institut für Wirtschaftsforschung",
    url: "https://www.diw.de",
  },
  {
    name: "Bundesministerium der Finanzen",
    description: "Informationen zur Einkommensteuer",
    url: "https://www.bundesfinanzministerium.de",
  },
]

export function DataSources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datenquellen</CardTitle>
        <CardDescription>Die dargestellten Daten basieren auf folgenden Quellen</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
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


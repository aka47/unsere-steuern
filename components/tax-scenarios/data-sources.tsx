import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const sources = [
  {
    name: "Destatis",
    description: "Statistisches Bundesamt - Income and Tax Statistics",
    url: "https://www.destatis.de/EN/Themes/Government/Taxes/Income-Tax/_node.html",
  },
  {
    name: "Bundesministerium der Finanzen",
    description: "Federal Ministry of Finance - Tax Revenue Statistics",
    url: "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/taxation.html",
  },
  {
    name: "DIW Berlin",
    description: "German Institute for Economic Research - Wealth Distribution Studies",
    url: "https://www.diw.de/en/diw_01.c.619420.en/research_projects/wealth_distribution_in_germany.html",
  },
]

export function DataSources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Sources and Assumptions</CardTitle>
        <CardDescription>The simulations are based on the following data sources and assumptions</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2">
          <li>Total wage income base: ~€1,100 billion</li>
          <li>Inheritance base: ~€400 billion</li>
          <li>Current tax revenue: ~€242 billion (€231 billion from wages, €11 billion from inheritances)</li>
          <li>
            Current progressive tax brackets are based on the latest available data from the Federal Ministry of Finance
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


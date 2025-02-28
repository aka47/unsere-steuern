"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const metrics = [
  {
    title: "Gesamtes Lohneinkommen",
    value: "1.678 Mrd. €",
    description: "Jährliches Bruttoeinkommen",
  },
  {
    title: "Lohnsteueraufkommen",
    value: "241.6 Mrd. €",
    description: "Jährliches Steueraufkommen",
  },
  {
    title: "Effektiver Steuersatz",
    value: "15%",
    description: "Durchschnittliche Steuerbelastung",
  },
]

export function IncomeOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { year: "2013", income: 950, tax: 200 },
  { year: "2014", income: 970, tax: 204 },
  { year: "2015", income: 990, tax: 208 },
  { year: "2016", income: 1010, tax: 212 },
  { year: "2017", income: 1030, tax: 216 },
  { year: "2018", income: 1050, tax: 220 },
  { year: "2019", income: 1070, tax: 224 },
  { year: "2020", income: 1090, tax: 228 },
  { year: "2021", income: 1100, tax: 231 },
]

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
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Entwicklung von Lohneinkommen und Steueraufkommen</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--secondary))" />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} Mrd. €`,
                  name === "income" ? "Lohneinkommen" : "Steueraufkommen",
                ]}
                labelFormatter={(label) => `Jahr ${label}`}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="income"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                name="Lohneinkommen"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="tax"
                stroke="hsl(var(--secondary))"
                fill="hsl(var(--secondary))"
                fillOpacity={0.2}
                name="Steueraufkommen"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}


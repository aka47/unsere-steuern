"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { year: "2013", amount: 11.1 },
  { year: "2014", amount: 11.3 },
  { year: "2015", amount: 11.5 },
  { year: "2016", amount: 11.8 },
  { year: "2017", amount: 12.0 },
  { year: "2018", amount: 12.3 },
  { year: "2019", amount: 12.5 },
  { year: "2020", amount: 12.8 },
  { year: "2021", amount: 13.0 },
  { year: "2022", amount: 13.2 },
]

const metrics = [
  {
    title: "Gesamtvermögen",
    value: "13,2 Bio. €",
    description: "Privates Nettovermögen",
  },
  {
    title: "Durchschnittsvermögen",
    value: "159.300 €",
    description: "Pro Haushalt",
  },
  {
    title: "Median-Vermögen",
    value: "70.800 €",
    description: "Pro Haushalt",
  },
  {
    title: "Jährliches Wachstum",
    value: "+3,1%",
    description: "Gegenüber Vorjahr",
  },
]

export function WealthOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Entwicklung des Gesamtvermögens</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${value} Bio. €`} domain={[10, 14]} />
              <Tooltip
                formatter={(value: number) => [`${value} Bio. €`, "Vermögen"]}
                labelFormatter={(label) => `Jahr ${label}`}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}


"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { totalWealth } from "@/data/wealth"
// Historical wealth data
const historicalData = [
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
  { year: "2023", amount: totalWealth },
]

export function WealthDevelopment() {
  return (
    <Card>
        <CardHeader>
          <CardTitle>Entwicklung des Gesamtvermögens</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historicalData}>
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${value} Bio. €`} domain={[10, 14]} />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)} Bio. €`, "Vermögen"]}
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
  )
}


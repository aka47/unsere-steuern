"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    group: "Untere 50%",
    percentage: 1.3,
    amount: "171,6 Mrd. €",
  },
  {
    group: "Mittlere 40%",
    percentage: 38.7,
    amount: "5,1 Bio. €",
  },
  {
    group: "Obere 10%",
    percentage: 60,
    amount: "7,92 Bio. €",
  },
  {
    group: "Obere 1%",
    percentage: 27.4,
    amount: "3,61 Bio. €",
  },
]

export function WealthDistribution() {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="group" />
          <YAxis tickFormatter={(value) => `${value}%`} />
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Anteil am Gesamtvermögen"]}
            labelFormatter={(label) => `Gruppe: ${label}`}
          />
          <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}


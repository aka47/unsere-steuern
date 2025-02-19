"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { percentile: "10%", income: 749, aggregate: 54 },
  { percentile: "20%", income: 1096, aggregate: 80 },
  { percentile: "30%", income: 1385, aggregate: 101 },
  { percentile: "40%", income: 1670, aggregate: 122 },
  { percentile: "50%", income: 1976, aggregate: 144 },
  { percentile: "60%", income: 2342, aggregate: 171 },
  { percentile: "70%", income: 2740, aggregate: 200 },
  { percentile: "80%", income: 3254, aggregate: 237 },
  { percentile: "90%", income: 4074, aggregate: 297 },
  { percentile: "100%", income: 8406, aggregate: 630 },
  { percentile: "Top 1%", income: 30287, aggregate: 209 },
]

export function IncomeDistribution() {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="percentile" />
          <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
          <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--secondary))" />
          <Tooltip
            formatter={(value: number, name: string) => [
              name === "income" ? `${value} €` : `${value} Mrd. €`,
              name === "income" ? "Monatseinkommen" : "Aggregiertes Jahreseinkommen",
            ]}
            labelFormatter={(label) => `Perzentil: ${label}`}
          />
          <Bar yAxisId="left" dataKey="income" fill="hsl(var(--primary))" name="Monatseinkommen" />
          <Bar yAxisId="right" dataKey="aggregate" fill="hsl(var(--secondary))" name="Aggregiertes Jahreseinkommen" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}


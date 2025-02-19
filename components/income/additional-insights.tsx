"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { type: "Lohneinkommen", gini: 0.29 },
  { type: "Kapitaleinkommen", gini: 0.76 },
  { type: "Gesamteinkommen", gini: 0.32 },
]

export function AdditionalInsights() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Der Gini-Koeffizient ist ein Maß für die Ungleichheit, wobei 0 perfekte Gleichheit und 1 maximale Ungleichheit
        bedeutet.
      </p>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="type" />
            <YAxis domain={[0, 1]} tickFormatter={(value) => value.toFixed(2)} />
            <Tooltip formatter={(value: number) => [`${value.toFixed(2)}`, "Gini-Koeffizient"]} />
            <Bar dataKey="gini" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm">
        Die Grafik zeigt, dass die Ungleichheit bei Kapitaleinkommen deutlich höher ist als bei Lohneinkommen. Dies
        unterstreicht die Bedeutung von Arbeitseinkommen für eine ausgeglichenere Gesamteinkommensverteilung.
      </p>
    </div>
  )
}


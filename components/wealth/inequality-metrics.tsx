"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Generate Lorenz curve data points
const lorenzData = Array.from({ length: 101 }, (_, i) => {
  const x = i / 100
  // This is a simplified curve - replace with actual data
  const y = Math.pow(x, 3)
  return {
    population: x * 100,
    wealth: y * 100,
    equality: x * 100,
  }
})

export function InequalityMetrics() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">0,816</div>
          <div className="text-sm text-muted-foreground">Gini-Koeffizient</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lorenzData}>
          <XAxis
            dataKey="population"
            tickFormatter={(value) => `${value}%`}
            label={{ value: "Bevölkerung (%)", position: "bottom" }}
          />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            label={{ value: "Vermögen (%)", angle: -90, position: "left" }}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)}%`, "Vermögensanteil"]}
            labelFormatter={(label) => `Bevölkerung: ${label}%`}
          />
          <Line
            type="monotone"
            dataKey="equality"
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            dot={false}
          />
          <Line type="monotone" dataKey="wealth" stroke="hsl(var(--primary))" dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="text-sm text-muted-foreground">
        Lorenz-Kurve: Zeigt die Vermögensverteilung im Vergleich zur perfekten Gleichverteilung (gestrichelte Linie)
      </div>
    </div>
  )
}


"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  {
    name: "Immobilien",
    value: 62,
  },
  {
    name: "Finanzvermögen",
    value: 23,
  },
  {
    name: "Betriebsvermögen",
    value: 9,
  },
  {
    name: "Sachvermögen",
    value: 6,
  },
]

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--primary) / 0.8)",
  "hsl(var(--primary) / 0.6)",
  "hsl(var(--primary) / 0.4)",
]

export function WealthTypeBreakdown() {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value}%`, "Anteil"]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {data.map((item, index) => (
          <div key={item.name} className="text-center">
            <div className="text-sm font-medium">{item.name}</div>
            <div className="text-2xl font-bold" style={{ color: COLORS[index] }}>
              {item.value}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


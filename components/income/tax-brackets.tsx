"use client"

import { useState } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const taxBrackets = [
  { min: 0, max: 11604, rate: 0 },
  { min: 11605, max: 17005, rate: 14 },
  { min: 17006, max: 66761, rate: 24 },
  { min: 66762, max: 277826, rate: 42 },
  { min: 277827, max: Number.POSITIVE_INFINITY, rate: 45 },
]

function calculateTax(income: number) {
  let tax = 0
  for (const bracket of taxBrackets) {
    if (income > bracket.min) {
      const taxableAmount = Math.min(income, bracket.max) - bracket.min
      tax += taxableAmount * (bracket.rate / 100)
    }
    if (income <= bracket.max) break
  }
  return tax
}

const chartData = Array.from({ length: 100 }, (_, i) => {
  const income = (i + 1) * 5000
  const tax = calculateTax(income)
  return { income, tax, effectiveRate: (tax / income) * 100 }
})

export function TaxBrackets() {
  const [income, setIncome] = useState(50000)
  const tax = calculateTax(income)
  const effectiveRate = (tax / income) * 100

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="income">Jahreseinkommen</Label>
          <div className="flex items-center space-x-2">
            <Input id="income" type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
            <Button onClick={() => setIncome(50000)}>Zurücksetzen</Button>
          </div>
        </div>
        <div className="space-y-2">
          <p>
            Zu zahlende Lohnsteuer: <strong>{tax.toFixed(2)} €</strong>
          </p>
          <p>
            Effektiver Steuersatz: <strong>{effectiveRate.toFixed(2)}%</strong>
          </p>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <XAxis
              dataKey="income"
              tickFormatter={(value) => `${value / 1000}k`}
              label={{ value: "Einkommen (€)", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              tickFormatter={(value) => `${value}%`}
              label={{ value: "Effektiver Steuersatz", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)}%`, "Effektiver Steuersatz"]}
              labelFormatter={(label) => `Einkommen: ${label} €`}
            />
            <Area
              type="monotone"
              dataKey="effectiveRate"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="text-sm text-muted-foreground">
        Die Grafik zeigt den effektiven Steuersatz basierend auf dem Jahreseinkommen. Beachten Sie, dass dies eine
        vereinfachte Darstellung ist und nicht alle Aspekte des deutschen Steuersystems berücksichtigt, wie z.B.
        Freibeträge oder Sonderausgaben.
      </div>
    </div>
  )
}


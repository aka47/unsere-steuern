"use client"

import { useState, useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PersonaCollectionStats } from "@/hooks/usePersonaCollectionCalculations"
import type { Persona } from "@/types/persona"

interface PersonaYearlyAverageProps {
  personas: Persona[]
  personaStats: PersonaCollectionStats[]
}

interface ChartData {
  name: string
  inheritance: number
  inheritanceTax: number
  wealth: number
  income: number
  tax: number
  taxRate: number
}

interface LegendData {
  dataKey: keyof ActiveLines
}

interface ActiveLines {
  inheritance: boolean
  inheritanceTax: boolean
  wealth: boolean
  income: boolean
  tax: boolean
}

export function PersonaYearlyAverage({ personas, personaStats }: PersonaYearlyAverageProps) {
  const [activeLines, setActiveLines] = useState<ActiveLines>({
    inheritance: true,
    inheritanceTax: true,
    wealth: true,
    income: true,
    tax: true,
  })

  const chartData = useMemo(() => {
    return personas.map((persona) => {
      const stat = personaStats.find((s) => s.persona.id === persona.id)
      if (!stat) return null

      return {
        name: persona.name,
        inheritance: stat.yearlyAverages.inheritanceReceived,
        inheritanceTax: stat.yearlyAverages.inheritanceTaxPaid,
        wealth: stat.yearlyAverages.wealth,
        income: stat.yearlyAverages.incomeReceived,
        tax: stat.yearlyAverages.taxPaid,
        taxRate: stat.yearlyAverages.taxRate,
      }
    }).filter(Boolean) as ChartData[]
  }, [personas, personaStats])

  const handleLegendClick = (data: LegendData) => {
    const key = data.dataKey
    setActiveLines((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const formatValue = (value: number, type: "currency" | "percentage") => {
    if (type === "percentage") {
      return `${(value * 100).toFixed(1)}%`
    }
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Jährliche Durchschnitte nach Person/Haushalt</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />

              <YAxis
                yAxisId="left"
                tickFormatter={(value: number) => formatValue(value, "currency")}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value: number) => formatValue(value, "percentage")}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === "reale Steuerquote") {
                    return [`${(value * 100).toFixed(2)}%`, name]
                  }
                  return [formatValue(value, "currency"), name]
                }}
                labelFormatter={(label) => `Persona: ${label}`}
              />
              <Legend
                onClick={(data) => handleLegendClick(data as LegendData)}
                wrapperStyle={{ cursor: "pointer" }}
              />
              <Line
                yAxisId="left"
                dataKey="inheritance"
                type="monotone"
                name="Erbrecht"
                stroke="#22c55e"
                strokeWidth={2}
                hide={!activeLines.inheritance}
              />
              <Line
                yAxisId="left"
                dataKey="inheritanceTax"
                type="monotone"
                name="Erbrechtsteuern"
                stroke="#16a34a"
                strokeWidth={2}
                hide={!activeLines.inheritanceTax}
              />
              <Line
                yAxisId="left"
                dataKey="wealth"
                type="monotone"
                name="Vermögen"
                stroke="#3b82f6"
                strokeWidth={2}
                hide={!activeLines.wealth}
              />
              <Line
                yAxisId="left"
                dataKey="income"
                type="monotone"
                name="Einkommen"
                stroke="#f59e0b"
                strokeWidth={2}
                hide={!activeLines.income}
              />
              <Line
                yAxisId="left"
                dataKey="tax"
                type="monotone"
                name="Steuern"
                stroke="#ef4444"
                strokeWidth={2}
                hide={!activeLines.tax}
              />
              <Line
                yAxisId="right"
                dataKey="taxRate"
                type="monotone"
                name="reale Steuerquote"
                stroke="#ff8042"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePersonaSegmentCollectionCalculator } from "@/hooks/usePersonaSegmentCalculator"
import { LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line } from "recharts"
import { Persona } from "@/types/persona"
import { StatCard } from "@/components/ui/stat-card"
import React from "react"
import { useTaxScenario } from "@/hooks/useTaxScenario"

export function PersonaGroupStats({ personas }: { personas: Persona[] }) {
  const { selectedTaxScenario } = useTaxScenario()
  const { personaStats } = usePersonaSegmentCollectionCalculator(personas, selectedTaxScenario)
  type LineKey = 'inheritance' | 'inheritanceTax' | 'wealth' | 'income' | 'tax';
  const [activeLines, setActiveLines] = React.useState<Record<LineKey, boolean>>({
    inheritance: true,
    inheritanceTax: true,
    wealth: true,
    income: true,
    tax: true,
  });

  const chartData = personaStats.map(stats => ({
    name: stats.persona.name,
    income: stats.yearlyAverages.incomeReceived,
    tax: stats.yearlyAverages.taxPaid,
    wealth: stats.yearlyAverages.wealth,
    taxRate: stats.yearlyAverages.taxRate * 100,
    inheritance: stats.yearlyAverages.inheritanceReceived,
    inheritanceTax: stats.yearlyAverages.inheritanceTaxPaid,
  }));
  console.log(chartData)
  console.log(personaStats)

  const handleLegendClick = (data: { dataKey?: unknown }) => {
    const key = data.dataKey;
    if (key && typeof key === 'string' && key in activeLines) {
      setActiveLines(prev => ({
        ...prev,
        [key as LineKey]: !prev[key as LineKey]
      }));
    }
  };

  const formatValue = (value: number, type: "currency" | "percentage" | "number") => {
    if (type === "currency") {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    }
    if (type === "percentage") {
      return new Intl.NumberFormat("de-DE", {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value / 100)
    }
    return new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wie beeinflussen diese Steuern den Konsum und Vermögen in der Bevölkerung - der Überblick</CardTitle>
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
                  tickFormatter={(value) => formatValue(value, "currency")}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => formatValue(value, "percentage")}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "reale Steuerquote") {
                      return [`${value.toFixed(1)}%`, name];
                    }
                    return [formatValue(value, "currency"), name];
                  }}
                  labelFormatter={(label) => `Persona: ${label}`}
                />
                <Legend
                  onClick={(data) => handleLegendClick(data)}
                  wrapperStyle={{ cursor: 'pointer' }}
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
                {/* <Line
                  yAxisId="right"
                  dataKey="taxRate"
                  type="monotone"
                  name="reale Steuerquote"
                  stroke="#ff8042"
                  strokeWidth={2}
                /> */}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gesamtsteuern"
          value={formatValue(personaStats.reduce((total, stats) => total + stats.totalTaxPaid, 0), "currency")}
          description="Summe aller Steuern"
        />
        <StatCard
          title="Gesamteinkommen"
          value={formatValue(personaStats.reduce((total, stats) => total + stats.totalIncomeReceived, 0), "currency")}
          description="Summe aller Einkommen"
        />
        <StatCard
          title="Gesamtvermögen"
          value={formatValue(personaStats.reduce((total, stats) => total + stats.totalWealth, 0), "currency")}
          description="Summe aller Vermögen"
        />
        <StatCard
          title="Durchschnittlicher Steuersatz"
          value={formatValue(personaStats.reduce((total, stats) => total + stats.totalTaxPaid, 0) / personaStats.length * 100, "percentage")}
          suffix="%"
          description="Durchschnittlicher Steuersatz"
        />
      </div>
    </div>
  )
}
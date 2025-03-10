"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePersonaSegmentCollectionCalculator } from "@/hooks/usePersonaSegmentCalculator"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Persona } from "@/types/persona"
import { StatCard } from "@/components/ui/stat-card"
import { formatMoney } from '@/components/utils/formatter'

export function PersonaGroupStats({ personas }: { personas: Persona[] }) {
  const { personaStats } = usePersonaSegmentCollectionCalculator(personas)

  const chartData = personaStats.map(stats => ({
    name: stats.persona.name,
    // income: stats.yearlyAverages.incomeReceived,
    // tax: stats.yearlyAverages.taxPaid,
    // wealth: stats.yearlyAverages.wealth,
    taxRate: stats.yearlyAverages.taxRate * 100
  }));
  console.log(chartData)
  console.log(personaStats)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wie beeinflussen diese Steuern den Konsum und Vermögen in der Bevölkerung - der Überblick</CardTitle>
        </CardHeader>
        <CardContent>
          ss
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${(value).toFixed(1)}%`, ""]}
                  labelFormatter={(label) => `Persona: ${label}`}
                />
                <Legend />
                <Bar dataKey="taxRate" stackId="a" name="reale Steuerquote" fill="#4CAF50" />

              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gesamtsteuern"
          value={formatMoney(personaStats.reduce((total, stats) => total + stats.totalTaxPaid, 0))}
          description="Summe aller Steuern"
        />
        <StatCard
          title="Gesamteinkommen"
          value={formatMoney(personaStats.reduce((total, stats) => total + stats.totalIncomeReceived, 0))}
          description="Summe aller Einkommen"
        />
        <StatCard
          title="Gesamtvermögen"
          value={formatMoney(personaStats.reduce((total, stats) => total + stats.totalWealth, 0))}
          description="Summe aller Vermögen"
        />
        <StatCard
          title="Durchschnittlicher Steuersatz"
          value={formatMoney(personaStats.reduce((total, stats) => total + stats.totalTaxPaid, 0) / personaStats.length * 100)}
          suffix="%"
          description="Durchschnittlicher Steuersatz"
        />
      </div>
    </div>
  )
}
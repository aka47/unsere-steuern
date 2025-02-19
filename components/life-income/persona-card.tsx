import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Persona } from "@/types/persona"
import { useLifeIncomeCalculator } from "@/hooks/useLifeIncomeCalculator"

interface PersonaCardProps {
  persona: Persona
  onClick: () => void
}

export function PersonaCard({ persona, onClick }: PersonaCardProps) {
  const { calculateLifeIncome } = useLifeIncomeCalculator()

  const results = calculateLifeIncome({
    currentIncome: persona.initialIncome,
    currentAge: 25,
    savingsRate: persona.savingsRate,
    inheritanceAge: 45,
    inheritanceAmount: persona.inheritanceAmount || 0,
    inheritanceTaxClass: 1,
    vatRate: 19,
    vatApplicableRate: 70,
    yearlySpending: persona.initialIncome * (1 - persona.savingsRate),
    selectedPersona: persona,
  })

  const lifetimeData = results ? [
    {
      name: "Income",
      value: results.totals.totalIncome
    },
    {
      name: "Final Wealth",
      value: results.totals.totalWealth
    },
    {
      name: "Taxes",
      value: results.totals.totalIncomeTax + results.totals.totalVAT + results.totals.totalInheritanceTax
    },
  ] : []

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{persona.icon}</span>
          {persona.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          {persona.description}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lifetimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 border rounded shadow">
                        <p>{payload[0].payload.name}</p>
                        <p className="font-bold">
                          {new Intl.NumberFormat("de-DE", {
                            style: "currency",
                            currency: "EUR"
                          }).format(payload[0].value as number)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}


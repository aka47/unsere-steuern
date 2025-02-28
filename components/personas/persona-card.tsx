import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { Persona } from "@/types/persona"
import { useLifeIncomeCalculator } from "@/hooks/useLifeIncomeCalculator"
import { TaxScenario } from "@/types/life-income"
import { defaultTaxScenario } from "@/constants/tax-scenarios"
import { useTaxScenario } from "@/hooks/useTaxScenario"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

interface PersonaCardProps {
  persona: Persona
  taxScenario?: TaxScenario
  onClick: () => void
}

export function PersonaCard({ persona, taxScenario: propsTaxScenario, onClick }: PersonaCardProps) {
  const { calculateLifeIncome } = useLifeIncomeCalculator()
  // Always call the hook, regardless of whether we use its value
  const { selectedTaxScenario } = useTaxScenario()

  // Use the tax scenario from props if provided, otherwise use the one from context
  const activeTaxScenario = propsTaxScenario || selectedTaxScenario

  // Calculate results with the selected tax scenario
  const selectedScenarioResults = calculateLifeIncome({
    ...persona,
    currentPersona: persona,
    taxScenario: activeTaxScenario,
    inheritanceAge: persona.inheritanceAge ?? 0
  })

  // Always calculate results with the default tax scenario for comparison
  const defaultScenarioResults = calculateLifeIncome({
    ...persona,
    currentPersona: persona,
    taxScenario: defaultTaxScenario,
    inheritanceAge: persona.inheritanceAge ?? 0
  })

  // Prepare data for comparison chart
  const comparisonData = [
    // {
    //   name: "Income",
    //   current: defaultScenarioResults?.totals.totalIncome || 0,
    //   proposed: selectedScenarioResults?.totals.totalIncome || 0
    // },
    {
      name: "Konsum",
      current: defaultScenarioResults?.totals.totalSpending || 0,
      proposed: selectedScenarioResults?.totals.totalSpending || 0
    },
    {
      name: "Vermögen",
      current: defaultScenarioResults?.totals.totalWealth || 0,
      proposed: selectedScenarioResults?.totals.totalWealth || 0
    },
    {
      name: "Steuern",
      current: (defaultScenarioResults?.totals.totalIncomeTax || 0) +
               (defaultScenarioResults?.totals.totalVAT || 0) +
               (defaultScenarioResults?.totals.totalInheritanceTax || 0),
      proposed: (selectedScenarioResults?.totals.totalIncomeTax || 0) +
                (selectedScenarioResults?.totals.totalVAT || 0) +
                (selectedScenarioResults?.totals.totalInheritanceTax || 0)
    },
  ]

  // Only show comparison if the selected scenario is different from default
  const showComparison = activeTaxScenario.id !== defaultTaxScenario.id

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
        {showComparison && (
          <p className="text-xs text-primary mt-1">
            Vergleich: {defaultTaxScenario.name} vs. {activeTaxScenario.name}
          </p>
        )}
      </CardHeader>
      <CardContent>

        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)}M`
                  } else if (value >= 1000) {
                    return `${(value / 1000).toFixed(0)}k`
                  }
                  return value
                }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 border rounded shadow">
                        <p className="font-medium">{label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} style={{ color: entry.color }}>
                            {entry.name === defaultTaxScenario.name ? `${defaultTaxScenario.name}: ` : `${activeTaxScenario.name}: `}
                            {new Intl.NumberFormat("de-DE", {
                              style: "currency",
                              currency: "EUR"
                            }).format(entry.value as number)}
                          </p>
                        ))}
                        {showComparison && payload.length > 1 && (
                          <p className="mt-2 pt-2 border-t">
                            Difference: {new Intl.NumberFormat("de-DE", {
                              style: "currency",
                              currency: "EUR",
                              signDisplay: "always"
                            }).format((payload[1].value as number) - (payload[0].value as number))}
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="current" name={defaultTaxScenario.name} fill="#8884d8" />
              {showComparison && <Bar dataKey="proposed" name={activeTaxScenario.name} fill="#82ca9d" />}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {showComparison && (
          <div className="mt-4 font-mono text-sm border-t pt-4 space-y-3">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex justify-between cursor-help">
                  <span>Steuerdifferenz:</span>
                  <span className={((selectedScenarioResults?.totals.totalIncomeTax || 0) + (selectedScenarioResults?.totals.totalVAT || 0) + (selectedScenarioResults?.totals.totalInheritanceTax || 0)) < ((defaultScenarioResults?.totals.totalIncomeTax || 0) + (defaultScenarioResults?.totals.totalVAT || 0) + (defaultScenarioResults?.totals.totalInheritanceTax || 0)) ? "text-green-600" : "text-red-600"}>
                    {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", signDisplay: "always" }).format(((selectedScenarioResults?.totals.totalIncomeTax || 0) + (selectedScenarioResults?.totals.totalVAT || 0) + (selectedScenarioResults?.totals.totalInheritanceTax || 0)) - ((defaultScenarioResults?.totals.totalIncomeTax || 0) + (defaultScenarioResults?.totals.totalVAT || 0) + (defaultScenarioResults?.totals.totalInheritanceTax || 0)))}
                  </span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Steuern ({activeTaxScenario.name}):</span>
                    <span>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format((selectedScenarioResults?.totals.totalIncomeTax || 0) + (selectedScenarioResults?.totals.totalVAT || 0) + (selectedScenarioResults?.totals.totalInheritanceTax || 0))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Steuern ({defaultTaxScenario.name}):</span>
                    <span>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format((defaultScenarioResults?.totals.totalIncomeTax || 0) + (defaultScenarioResults?.totals.totalVAT || 0) + (defaultScenarioResults?.totals.totalInheritanceTax || 0))}</span>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex justify-between cursor-help border-t-2 pt-2 font-bold">
                  <span>Gesamtdifferenz:</span>
                  <span className={((selectedScenarioResults?.totals.totalSpending || 0) + (selectedScenarioResults?.totals.totalWealth || 0)) > ((defaultScenarioResults?.totals.totalSpending || 0) + (defaultScenarioResults?.totals.totalWealth || 0)) ? "text-green-600" : "text-red-600"}>
                    {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", signDisplay: "always" }).format(((selectedScenarioResults?.totals.totalSpending || 0) + (selectedScenarioResults?.totals.totalWealth || 0)) - ((defaultScenarioResults?.totals.totalSpending || 0) + (defaultScenarioResults?.totals.totalWealth || 0)))}
                  </span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <div>
                    <div className="font-medium mb-2">{activeTaxScenario.name}:</div>
                    <div className="flex justify-between text-sm">
                      <span>Konsum:</span>
                      <span>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(selectedScenarioResults?.totals.totalSpending || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Vermögen:</span>
                      <span>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(selectedScenarioResults?.totals.totalWealth || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-dashed mt-1 pt-1">
                      <span>Summe:</span>
                      <span>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format((selectedScenarioResults?.totals.totalSpending || 0) + (selectedScenarioResults?.totals.totalWealth || 0))}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="font-medium mb-2">{defaultTaxScenario.name}:</div>
                    <div className="flex justify-between text-sm">
                      <span>Konsum:</span>
                      <span>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(defaultScenarioResults?.totals.totalSpending || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Vermögen:</span>
                      <span>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(defaultScenarioResults?.totals.totalWealth || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-dashed mt-1 pt-1">
                      <span>Summe:</span>
                      <span>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format((defaultScenarioResults?.totals.totalSpending || 0) + (defaultScenarioResults?.totals.totalWealth || 0))}</span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { Persona } from "@/types/persona"
import { useLifeIncomeCalculator } from "@/hooks/useLifeIncomeCalculator"
import type { TaxScenario } from "@/types/life-income"
import { defaultTaxScenario } from "@/constants/tax-scenarios"
import { useTaxScenario } from "@/hooks/useTaxScenario"
import { useTaxScenarioCalculator } from "@/hooks/useTaxScenarioCalculator"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useState } from "react"
import { CalendarDays, LifeBuoy, Database } from "lucide-react"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatCurrency } from "@/lib/utils"

// Add a type for the view options
type ViewType = "lifetime" | "annual" | "data"

export interface PersonaCardProps {
  persona: Persona
  taxScenario: TaxScenario
  onClick?: () => void
}

// Update the PersonaCard component to include the icon navigation and different views
export function PersonaCard({ persona, taxScenario: propsTaxScenario, onClick }: PersonaCardProps) {
  // Add state to track the selected view
  const [view, setView] = useState<ViewType>("lifetime")

  const { selectedScenarioId, taxParams, selectedTaxScenario } = useTaxScenario()
  const { createCustomTaxScenario } = useTaxScenarioCalculator()
  const { calculateLifeIncome } = useLifeIncomeCalculator()

  // Get the active scenario based on selection
  const activeTaxScenario = selectedScenarioId === "custom"
    ? createCustomTaxScenario(taxParams)
    : selectedTaxScenario

  console.log("selectedScenarioId:", selectedScenarioId)
  console.log("activeTaxScenario:", activeTaxScenario)
  console.log("propsTaxScenario:", propsTaxScenario)
  console.log("selectedTaxScenario:", selectedTaxScenario)

  // Calculate results for both scenarios
  const defaultScenarioResults = calculateLifeIncome({
    ...persona,
    taxScenario: defaultTaxScenario,
    yearlySpendingFromWealth: persona.yearlySpendingFromWealth || 0,
    currentWealth: persona.currentWealth || 0,
    inheritanceAge: persona.inheritanceAge ?? 20,
    inheritanceAmount: persona.inheritanceAmount || 0,
    inheritanceTaxClass: persona.inheritanceTaxClass || 1,
    inheritanceTaxableHousingFinancial: persona.inheritanceAmount,
    inheritanceTaxableCompany: 0,
    inheritanceHardship: false
  })

  const selectedScenarioResults = calculateLifeIncome({
    ...persona,
    taxScenario: activeTaxScenario,
    yearlySpendingFromWealth: persona.yearlySpendingFromWealth || 0,
    currentWealth: persona.currentWealth || 0,
    inheritanceAge: persona.inheritanceAge ?? 20,
    inheritanceAmount: persona.inheritanceAmount || 0,
    inheritanceTaxClass: persona.inheritanceTaxClass || 1,
    inheritanceTaxableHousingFinancial: persona.inheritanceAmount,
    inheritanceTaxableCompany: 0,
    inheritanceHardship: false
  })

  console.log("defaultScenarioResults", defaultScenarioResults)
  console.log("selectedScenarioResults", selectedScenarioResults)

  // Only show comparison if the selected scenario is different from default
  const showComparison = activeTaxScenario.id !== defaultTaxScenario.id

  console.log("showComparison", showComparison)
  // Prepare data for comparison chart
  const comparisonData = [
    {
      name: "Konsum",
      current: defaultScenarioResults?.totals.totalSpending || 0,
      proposed: selectedScenarioResults?.totals.totalSpending || 0,
    },
    {
      name: "Vermögen",
      current: defaultScenarioResults?.totals.totalWealth || 0,
      proposed: selectedScenarioResults?.totals.totalWealth || 0,
    },
    {
      name: "Steuern",
      current:
        (defaultScenarioResults?.totals.totalTax || 0),
      proposed:
        (selectedScenarioResults?.totals.totalTax || 0),
    },
  ]

  // Calculate annual averages for the annual view
  const annualData = [
    {
      name: "Einkommen",
      current: (defaultScenarioResults?.totals.totalIncome || 0) / (67 - persona.initialAge),
      proposed: (selectedScenarioResults?.totals.totalIncome || 0) / (67 - persona.initialAge),
    },
    {
      name: "Konsum",
      current: (defaultScenarioResults?.totals.totalSpending || 0) / (67 - persona.initialAge),
      proposed: (selectedScenarioResults?.totals.totalSpending || 0) / (67 - persona.initialAge),
    },
    {
      name: "Steuern",
      current:
        ((defaultScenarioResults?.totals.totalIncomeTax || 0) + (defaultScenarioResults?.totals.totalVAT || 0)) /
        (67 - persona.initialAge),
      proposed:
        ((selectedScenarioResults?.totals.totalIncomeTax || 0) + (selectedScenarioResults?.totals.totalVAT || 0)) /
        (67 - persona.initialAge),
    },
  ]

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{persona.icon}</span>
            {persona.name}
          </CardTitle>

          {/* Icon Navigation */}
          <TooltipProvider>
            <div className="flex space-x-2">
              <UITooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`p-1.5 rounded-full ${view === "lifetime" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setView("lifetime")
                    }}
                  >
                    <LifeBuoy size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Lebenseinkommen</p>
                </TooltipContent>
              </UITooltip>

              <UITooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`p-1.5 rounded-full ${view === "annual" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setView("annual")
                    }}
                  >
                    <CalendarDays size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Jahreseinkommen</p>
                </TooltipContent>
              </UITooltip>

              <UITooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`p-1.5 rounded-full ${view === "data" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setView("data")
                    }}
                  >
                    <Database size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Daten</p>
                </TooltipContent>
              </UITooltip>
            </div>
          </TooltipProvider>
        </div>

        <p className="text-sm text-muted-foreground mt-2">{persona.description}</p>
        {showComparison && view !== "data" && (
          <p className="text-xs text-primary mt-1">
            Vergleich: {defaultTaxScenario.name} vs. {activeTaxScenario.name}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {/* Lifetime Income View */}
        {view === "lifetime" && (
          <>
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
                                {entry.name === defaultTaxScenario.name
                                  ? `${defaultTaxScenario.name}: `
                                  : `${activeTaxScenario.name}: `}
                                {formatCurrency(entry.value as number)}
                              </p>
                            ))}
                            {showComparison && payload.length > 1 && (
                              <p className="mt-2 pt-2 border-t">
                                Difference:{" "}
                                {formatCurrency((payload[1].value as number) - (payload[0].value as number))}
                              </p>
                            )}
                          </div>
                        )
                      }
                      return null
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
                      <span
                        className={
                          (selectedScenarioResults?.totals.totalTax || 0) <
                          (defaultScenarioResults?.totals.totalTax || 0)
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {formatCurrency(
                          (selectedScenarioResults?.totals.totalTax || 0) -
                            ((defaultScenarioResults?.totals.totalTax || 0)),
                        )}
                      </span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Steuern ({activeTaxScenario.name}):</span>
                        <span>
                          {formatCurrency(
                            (selectedScenarioResults?.totals.totalTax || 0),
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Steuern ({defaultTaxScenario.name}):</span>
                        <span>
                          {formatCurrency(
                            (defaultScenarioResults?.totals.totalTax || 0),
                          )}
                        </span>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex justify-between cursor-help border-t-2 pt-2 font-bold">
                      <span>Gesamtdifferenz:</span>
                      <span
                        className={
                          (selectedScenarioResults?.totals.totalSpending || 0) +
                            (selectedScenarioResults?.totals.totalWealth || 0) >
                          (defaultScenarioResults?.totals.totalSpending || 0) +
                            (defaultScenarioResults?.totals.totalWealth || 0)
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {formatCurrency(
                          (selectedScenarioResults?.totals.totalSpending || 0) +
                            (selectedScenarioResults?.totals.totalWealth || 0) -
                            ((defaultScenarioResults?.totals.totalSpending || 0) +
                              (defaultScenarioResults?.totals.totalWealth || 0)),
                        )}
                      </span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <div>
                        <div className="font-medium mb-2">{activeTaxScenario.name}:</div>
                        <div className="flex justify-between text-sm">
                          <span>Konsum:</span>
                          <span>
                            {formatCurrency(
                              selectedScenarioResults?.totals.totalSpending || 0,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Vermögen:</span>
                          <span>
                            {formatCurrency(
                              selectedScenarioResults?.totals.totalWealth || 0,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm border-t border-dashed mt-1 pt-1">
                          <span>Summe:</span>
                          <span>
                            {formatCurrency(
                              (selectedScenarioResults?.totals.totalSpending || 0) +
                                (selectedScenarioResults?.totals.totalWealth || 0),
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="font-medium mb-2">{defaultTaxScenario.name}:</div>
                        <div className="flex justify-between text-sm">
                          <span>Konsum:</span>
                          <span>
                            {formatCurrency(
                              defaultScenarioResults?.totals.totalSpending || 0,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Vermögen:</span>
                          <span>
                            {formatCurrency(
                              defaultScenarioResults?.totals.totalWealth || 0,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm border-t border-dashed mt-1 pt-1">
                          <span>Summe:</span>
                          <span>
                            {formatCurrency(
                              (defaultScenarioResults?.totals.totalSpending || 0) +
                                (defaultScenarioResults?.totals.totalWealth || 0),
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            )}
          </>
        )}

        {/* Annual Income View */}
        {view === "annual" && (
          <>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={annualData}>
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
                            <p className="font-medium">{label} (Jährlich)</p>
                            {payload.map((entry, index) => (
                              <p key={index} style={{ color: entry.color }}>
                                {entry.name === defaultTaxScenario.name
                                  ? `${defaultTaxScenario.name}: `
                                  : `${activeTaxScenario.name}: `}
                                {formatCurrency(entry.value as number)}
                              </p>
                            ))}
                            {showComparison && payload.length > 1 && (
                              <p className="mt-2 pt-2 border-t">
                                Difference:{" "}
                                {formatCurrency((payload[1].value as number) - (payload[0].value as number))}
                              </p>
                            )}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend />
                  <Bar dataKey="current" name={defaultTaxScenario.name} fill="#8884d8" />
                  {showComparison && <Bar dataKey="proposed" name={activeTaxScenario.name} fill="#82ca9d" />}
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 text-sm border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Durchschnittliches Jahreseinkommen:</p>
                  <p>
                    {formatCurrency(
                      (selectedScenarioResults?.totals.totalIncome || 0) / (selectedScenarioResults?.details.length || 1),
                    )}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Effektiver Steuersatz:</p>
                  <p>
                    {(
                      (((selectedScenarioResults?.totals.totalTax || 0)) /
                        (((selectedScenarioResults?.totals.totalIncome || 0 ) + (selectedScenarioResults?.totals.totalWealthGrowth || 0) + (selectedScenarioResults?.totals.totalInheritance || 0)) || 1)) *
                      100
                    ).toFixed(2)}
                    %
                  </p>
                </div>
                <div>
                  <p className="font-medium">Arbeitsjahre:</p>
                  <p>{67 - persona.initialAge} Jahre</p>
                </div>
                <div>
                  <p className="font-medium">Jährliche Ersparnis:</p>
                  <p>
                    {formatCurrency(
                      (selectedScenarioResults?.totals.totalWealth || 0) / (67 - persona.initialAge),
                    )}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Data View */}
        {view === "data" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Alter:</p>
                <p className="text-lg">{persona.currentAge} Jahre</p>
              </div>
              <div>
                <p className="text-sm font-medium">Einkommen:</p>
                <p className="text-lg">
                  {formatCurrency(persona.currentIncome)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Sparrate:</p>
                <p className="text-lg">{(persona.savingsRate * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Erbschaft:</p>
                <p className="text-lg">
                  {persona.inheritanceAge
                    ? `${formatCurrency(persona.inheritanceAmount)} (${persona.inheritanceAge} Jahre)`
                    : "Keine"}
                </p>
              </div>
            </div>

            {persona.examples && persona.examples.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <p className="font-medium mb-2">Beispiele:</p>
                <div className="space-y-2">
                  {persona.examples.map((example, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium">{example.profession}</p>
                      <p className="text-muted-foreground">{example.yearlyIncome}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* {persona.yearlyOverrides.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <p className="font-medium mb-2">Jährliche Überschreibungen:</p>
                <div className="max-h-[120px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1">Jahr</th>
                        <th className="text-right py-1">Einkommen</th>
                        <th className="text-right py-1">Vermögen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {persona.yearlyOverrides
                        .sort((a, b) => a.year - b.year)
                        .map((override, index) => (
                          <tr key={index} className="border-b border-dashed">
                            <td className="py-1">{override.year}</td>
                            <td className="text-right py-1">
                              {override.income
                                ? formatCurrency(override.income)
                                : "-"}
                            </td>
                            <td className="text-right py-1">
                              {override.wealth
                                ? formatCurrency(override.wealth)
                                : "-"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )} */}
          </div>
        )}
      </CardContent>
    </Card>
  )
}


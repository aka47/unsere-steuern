"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { taxScenarios } from "@/constants/tax-scenarios"
import { TypographyH4, TypographyP } from "@/components/ui/typography"
import { useLifeIncomeCalculator } from "@/hooks/useLifeIncomeCalculator"
import { initialPersonas } from "@/types/persona"



interface ChartDataItem {
  name: string;
  [key: string]: string | number;
}

export function TaxScenarioComparison() {
  const [activeTab, setActiveTab] = useState("totalTax")
  const { calculateLifeIncome } = useLifeIncomeCalculator()

  // Use a few representative personas for comparison
  const representativePersonas = initialPersonas.slice(0, 3)

  // Calculate results for each scenario and persona
  const comparisonData = representativePersonas.map(persona => {
    const scenarioResults = Object.values(taxScenarios).map(scenario => {
      const results = calculateLifeIncome({
        ...persona,
        taxScenario: scenario,
        yearlySpendingFromWealth: persona.yearlySpendingFromWealth || 0,
        currentWealth: persona.currentWealth || 0,
        inheritanceAge: persona.inheritanceAge ?? 20,
        inheritanceAmount: persona.inheritanceAmount || 0,
        inheritanceTaxClass: persona.inheritanceTaxClass || 1,
        inheritanceTaxableHousingFinancial: persona.inheritanceAmount, // Assume 40% is housing
        inheritanceTaxableCompany: 0, // Assume 20% is company
        inheritanceHardship: false // Default to false
      })

      // Default values if results or totals are undefined
      const totalIncomeTax = results?.totals?.totalIncomeTax || 0
      const totalWealthTax = results?.totals?.totalWealthTax || 0
      const totalWealthIncomeTax = results?.totals?.totalWealthIncomeTax || 0
      const totalIncome = results?.totals?.totalIncome || 0
      const totalWealthIncome = results?.totals?.totalWealthIncome || 0
      const totalWealth = results?.totals?.totalWealth || 0

      // Calculate total tax
      const totalTax = totalIncomeTax + totalWealthTax + totalWealthIncomeTax

      // Calculate effective tax rate (avoid division by zero)
      const totalIncomeSum = totalIncome + totalWealthIncome
      const effectiveTaxRate = totalIncomeSum > 0 ? (totalTax / totalIncomeSum) * 100 : 0

      return {
        scenarioName: scenario.name,
        scenarioId: scenario.id,
        totalTax,
        incomeTax: totalIncomeTax,
        wealthTax: totalWealthTax,
        wealthIncomeTax: totalWealthIncomeTax,
        finalWealth: totalWealth,
        effectiveTaxRate
      }
    })

    return {
      personaName: persona.name,
      personaId: persona.id,
      scenarios: scenarioResults
    }
  })

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value)
  }

  // Format percentage values
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  // Prepare data for the chart based on active tab
  const getChartData = (): ChartDataItem[] => {
    const data: ChartDataItem[] = []

    Object.values(taxScenarios).forEach(scenario => {
      const item: ChartDataItem = { name: scenario.name }

      representativePersonas.forEach(persona => {
        const personaData = comparisonData.find(p => p.personaId === persona.id)
        const scenarioData = personaData?.scenarios.find(s => s.scenarioId === scenario.id)

        if (activeTab === 'totalTax') {
          item[persona.name] = scenarioData?.totalTax || 0
        } else if (activeTab === 'taxBreakdown') {
          item[`${persona.name} - Einkommensteuer`] = scenarioData?.incomeTax || 0
          item[`${persona.name} - Vermögensteuer`] = scenarioData?.wealthTax || 0
          item[`${persona.name} - Kapitalertragssteuer`] = scenarioData?.wealthIncomeTax || 0
        } else if (activeTab === 'finalWealth') {
          item[persona.name] = scenarioData?.finalWealth || 0
        } else if (activeTab === 'effectiveTaxRate') {
          item[persona.name] = scenarioData?.effectiveTaxRate || 0
        }
      })

      data.push(item)
    })

    return data
  }

  // Generate bars for the chart
  const renderBars = () => {
    if (activeTab === 'taxBreakdown') {
      const bars: JSX.Element[] = []
      representativePersonas.forEach(persona => {
        bars.push(
          <Bar
            key={`${persona.id}-income`}
            dataKey={`${persona.name} - Einkommensteuer`}
            stackId={persona.id}
            fill="#8884d8"
            name={`${persona.name} - Einkommensteuer`}
          />
        )
        bars.push(
          <Bar
            key={`${persona.id}-wealth`}
            dataKey={`${persona.name} - Vermögensteuer`}
            stackId={persona.id}
            fill="#82ca9d"
            name={`${persona.name} - Vermögensteuer`}
          />
        )
        bars.push(
          <Bar
            key={`${persona.id}-capital`}
            dataKey={`${persona.name} - Kapitalertragssteuer`}
            stackId={persona.id}
            fill="#ffc658"
            name={`${persona.name} - Kapitalertragssteuer`}
          />
        )
      })
      return bars
    }

    return representativePersonas.map(persona => (
      <Bar
        key={persona.id}
        dataKey={persona.name}
        fill={persona.id === representativePersonas[0].id ? '#8884d8' :
              persona.id === representativePersonas[1].id ? '#82ca9d' : '#ffc658'}
      />
    ))
  }

  // Custom tooltip formatter
  const customTooltipFormatter = (value: number) => {
    if (activeTab === 'effectiveTaxRate') {
      return formatPercentage(value)
    }
    return formatCurrency(value)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4">
          <TypographyH4>Steuerszenarien im Vergleich</TypographyH4>
          <TypographyP className="text-muted-foreground">
            Vergleich der Auswirkungen verschiedener Steuermodelle auf unterschiedliche Lebensrealitäten
          </TypographyP>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="totalTax">Gesamtsteuern</TabsTrigger>
            <TabsTrigger value="taxBreakdown">Steuerarten</TabsTrigger>
            <TabsTrigger value="finalWealth">Endvermögen</TabsTrigger>
            <TabsTrigger value="effectiveTaxRate">Effektiver Steuersatz</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getChartData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={value =>
                      activeTab === 'effectiveTaxRate'
                        ? formatPercentage(value)
                        : formatCurrency(value)
                    }
                  />
                  <Tooltip
                    formatter={customTooltipFormatter}
                    labelFormatter={(label) => `Szenario: ${label}`}
                  />
                  <Legend />
                  {renderBars()}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
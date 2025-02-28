"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { type Persona } from "@/types/persona"
import { taxScenarios } from "@/constants/tax-scenarios"
import { useLifeIncomeCalculator } from "@/hooks/useLifeIncomeCalculator"
import { TypographyH3, TypographyMuted } from "@/components/ui/typography"

interface TaxScenarioComparisonProps {
  persona: Persona
  currentWealth: number
  yearlySpendingFromWealth: number
}

type ComparisonResult = {
  scenarioId: string
  scenarioName: string
  totalIncome: number
  totalIncomeTax: number
  totalWealthIncome: number
  totalWealthIncomeTax: number
  totalWealthTax: number
  totalInheritanceTax: number
  totalVAT: number
  finalWealth: number
  effectiveTaxRate: number
  totalTaxes: number
}

export function TaxScenarioComparison({
  persona,
  currentWealth,
  yearlySpendingFromWealth
}: TaxScenarioComparisonProps) {
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[]>([])
  const [activeTab, setActiveTab] = useState("total-taxes")
  const { calculateLifeIncome } = useLifeIncomeCalculator()

  useEffect(() => {
    const results: ComparisonResult[] = []

    for (const scenario of taxScenarios) {
      const calculationResult = calculateLifeIncome({
        ...persona,
        currentWealth,
        yearlySpendingFromWealth,
        taxScenario: scenario,
        inheritanceAge: persona.inheritanceAge ?? 0
      })

      if (calculationResult) {
        const { totals } = calculationResult
        const totalTaxes = totals.totalIncomeTax +
                          totals.totalWealthIncomeTax +
                          totals.totalWealthTax +
                          totals.totalInheritanceTax +
                          totals.totalVAT

        const effectiveTaxRate = (totalTaxes /
          (totals.totalIncome + totals.totalWealthIncome + totals.totalInheritance)) * 100

        results.push({
          scenarioId: scenario.id,
          scenarioName: scenario.name,
          totalIncome: totals.totalIncome,
          totalIncomeTax: totals.totalIncomeTax,
          totalWealthIncome: totals.totalWealthIncome,
          totalWealthIncomeTax: totals.totalWealthIncomeTax,
          totalWealthTax: totals.totalWealthTax,
          totalInheritanceTax: totals.totalInheritanceTax,
          totalVAT: totals.totalVAT,
          finalWealth: totals.totalWealth,
          effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
          totalTaxes
        })
      }
    }

    setComparisonResults(results)
  }, [persona, currentWealth, yearlySpendingFromWealth, calculateLifeIncome])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  const getTaxBreakdownData = () => {
    return comparisonResults.map(result => ({
      name: result.scenarioName,
      Einkommensteuer: result.totalIncomeTax,
      Kapitalertragsteuer: result.totalWealthIncomeTax,
      Vermögensteuer: result.totalWealthTax,
      Erbschaftsteuer: result.totalInheritanceTax,
      Mehrwertsteuer: result.totalVAT
    }))
  }

  const getWealthComparisonData = () => {
    return comparisonResults.map(result => ({
      name: result.scenarioName,
      "Endvermögen": result.finalWealth
    }))
  }

  const getEffectiveTaxRateData = () => {
    return comparisonResults.map(result => ({
      name: result.scenarioName,
      "Effektiver Steuersatz": result.effectiveTaxRate
    }))
  }

  const getTotalTaxesData = () => {
    return comparisonResults.map(result => ({
      name: result.scenarioName,
      "Gesamtsteuern": result.totalTaxes
    }))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vergleich der Steuerszenarien</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="total-taxes">Gesamtsteuern</TabsTrigger>
            <TabsTrigger value="tax-breakdown">Steuerarten</TabsTrigger>
            <TabsTrigger value="wealth">Endvermögen</TabsTrigger>
            <TabsTrigger value="effective-rate">Effektiver Steuersatz</TabsTrigger>
          </TabsList>

          <TabsContent value="total-taxes" className="mt-4">
            <TypographyH3>Gesamtsteuern im Lebensverlauf</TypographyH3>
            <TypographyMuted className="mb-4">
              Vergleich der Gesamtsteuerlast über den Lebensverlauf in verschiedenen Steuerszenarien
            </TypographyMuted>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getTotalTaxesData()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="Gesamtsteuern" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="tax-breakdown" className="mt-4">
            <TypographyH3>Steuerarten im Vergleich</TypographyH3>
            <TypographyMuted className="mb-4">
              Aufschlüsselung der verschiedenen Steuerarten in jedem Szenario
            </TypographyMuted>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getTaxBreakdownData()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="Einkommensteuer" stackId="a" fill="#8884d8" />
                  <Bar dataKey="Kapitalertragsteuer" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="Vermögensteuer" stackId="a" fill="#ffc658" />
                  <Bar dataKey="Erbschaftsteuer" stackId="a" fill="#ff8042" />
                  <Bar dataKey="Mehrwertsteuer" stackId="a" fill="#0088fe" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="wealth" className="mt-4">
            <TypographyH3>Endvermögen im Vergleich</TypographyH3>
            <TypographyMuted className="mb-4">
              Vergleich des Endvermögens im Alter von 65 Jahren in verschiedenen Steuerszenarien
            </TypographyMuted>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getWealthComparisonData()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="Endvermögen" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="effective-rate" className="mt-4">
            <TypographyH3>Effektiver Steuersatz</TypographyH3>
            <TypographyMuted className="mb-4">
              Vergleich des effektiven Steuersatzes über den gesamten Lebensverlauf
            </TypographyMuted>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getEffectiveTaxRateData()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => formatPercentage(value)} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => formatPercentage(Number(value))} />
                  <Legend />
                  <Bar dataKey="Effektiver Steuersatz" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
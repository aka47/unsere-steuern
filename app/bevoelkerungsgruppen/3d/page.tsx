"use client"

import { useState, useEffect } from "react"
import { PersonaCollectionOverTime } from "@/components/visualizations/persona-collection-over-time"
import { grokPersonas as personas, Persona } from "@/types/persona"
import { TaxScenarioNavigation } from "@/components/tax-scenarios/tax-scenario-navigation"
import { TaxScenarioProvider, useTaxScenario } from "@/hooks/useTaxScenario"
import { TaxScenario } from "@/types/life-income"
import { useLifeIncomeCalculator } from "@/hooks/useLifeIncomeCalculator"
import { defaultTaxScenario } from "@/constants/tax-scenarios"
import { PersonaCollectionStats } from "@/hooks/usePersonaCollectionCalculations"

// Sample data generator function
function GenerateSampleData(personas: Persona[], startYear: number, endYear: number, taxScenario: TaxScenario) {
  const data: PersonaCollectionStats[] = []
  const { calculateLifeIncome } = useLifeIncomeCalculator()

  for (const persona of personas) {
    // Base values that will be different for each persona
    const baseIncome = persona.currentIncome
    const baseWealth = baseIncome * 5

    const details = []
    for (let year = startYear; year <= endYear; year++) {
      // Calculate growth factors based on years
      const yearsSinceStart = year - startYear
      const growthFactor = 1 + yearsSinceStart * 0.03 // 3% annual growth

      // Apply some randomness
      const randomFactor = 0.9 + Math.random() * 0.2 // Between 0.9 and 1.1

      // Calculate base values
      const income = baseIncome * growthFactor * randomFactor
      const wealth = baseWealth * Math.pow(growthFactor, 1.2) * randomFactor

      // Calculate tax using the tax scenario
      const calculationResult = calculateLifeIncome({
        ...persona,
        currentWealth: wealth,
        yearlySpendingFromWealth: 0,
        taxScenario,
        inheritanceAge: persona.inheritanceAge ?? 0,
        inheritanceTaxableHousingFinancial: 0,
        inheritanceTaxableCompany: 0,
        inheritanceHardship: false
      })

      if (calculationResult) {
        details.push({
          age: year - startYear + 20, // Convert year to age starting from 20
          income,
          incomeTax: calculationResult.totals.totalIncomeTax,
          wealth,
          wealthGrowth: calculationResult.totals.totalWealthGrowth,
          wealthIncome: calculationResult.totals.totalWealthIncome,
          wealthTax: calculationResult.totals.totalWealthTax,
          inheritance: calculationResult.totals.totalInheritance,
          inheritanceTax: calculationResult.totals.totalInheritanceTax,
          vat: calculationResult.totals.totalVAT,
          spending: calculationResult.totals.totalSpending,
          tax: calculationResult.totals.totalTax,
          taxRate: calculationResult.totals.totalTax / (calculationResult.totals.totalIncome + calculationResult.totals.totalWealth)
        })
      }
    }

    data.push({
      persona,
      totalTaxPaid: details.reduce((sum, d) => sum + d.tax, 0),
      totalIncomeReceived: details.reduce((sum, d) => sum + d.income, 0),
      totalWealth: details[details.length - 1]?.wealth || 0,
      totalVATPaid: details.reduce((sum, d) => sum + d.vat, 0),
      totalInheritanceReceived: details.reduce((sum, d) => sum + d.inheritance, 0),
      totalInheritanceTaxPaid: details.reduce((sum, d) => sum + d.inheritanceTax, 0),
      totalSpending: details.reduce((sum, d) => sum + d.spending, 0),
      totalSavings: details.reduce((sum, d) => sum + (d.income - d.spending), 0),
      totalSpendingFromWealth: details.reduce((sum, d) => sum + (d.spending * 0.3), 0), // Assume 30% from wealth
      totalSpendingFromIncome: details.reduce((sum, d) => sum + (d.spending * 0.7), 0), // Assume 70% from income
      averageTaxRate: details.reduce((sum, d) => sum + d.taxRate, 0) / details.length,
      averageIncomeTaxRate: details.reduce((sum, d) => sum + (d.incomeTax / d.income), 0) / details.length,
      averageWealthTaxRate: details.reduce((sum, d) => sum + (d.wealthTax / d.wealth), 0) / details.length,
      populationSize: 1,
      yearlyAverages: {
        taxPaid: details.reduce((sum, d) => sum + d.tax, 0) / details.length,
        incomeReceived: details.reduce((sum, d) => sum + d.income, 0) / details.length,
        wealth: details.reduce((sum, d) => sum + d.wealth, 0) / details.length,
        vatPaid: details.reduce((sum, d) => sum + d.vat, 0) / details.length,
        inheritanceReceived: details.reduce((sum, d) => sum + d.inheritance, 0) / details.length,
        inheritanceTaxPaid: details.reduce((sum, d) => sum + d.inheritanceTax, 0) / details.length,
        spending: details.reduce((sum, d) => sum + d.spending, 0) / details.length,
        savings: details.reduce((sum, d) => sum + (d.income - d.spending), 0) / details.length,
        spendingFromWealth: details.reduce((sum, d) => sum + (d.spending * 0.3), 0) / details.length,
        spendingFromIncome: details.reduce((sum, d) => sum + (d.spending * 0.7), 0) / details.length,
        taxRate: details.reduce((sum, d) => sum + d.taxRate, 0) / details.length
      },
      taxDistribution: {
        incomeTax: details.reduce((sum, d) => sum + d.incomeTax, 0),
        vat: details.reduce((sum, d) => sum + d.vat, 0),
        wealthTax: details.reduce((sum, d) => sum + d.wealthTax, 0),
        wealthIncomeTax: details.reduce((sum, d) => sum + d.wealthTax, 0),
        total: details.reduce((sum, d) => sum + d.tax, 0)
      },
      results: {
        totals: {
          totalWealth: details[details.length - 1]?.wealth || 0,
          totalIncome: details.reduce((sum, d) => sum + d.income, 0),
          totalIncomeTax: details.reduce((sum, d) => sum + d.incomeTax, 0),
          totalWealthIncome: details.reduce((sum, d) => sum + d.wealthIncome, 0),
          totalWealthIncomeTax: details.reduce((sum, d) => sum + d.wealthTax, 0),
          totalWealthTax: details.reduce((sum, d) => sum + d.wealthTax, 0),
          totalVAT: details.reduce((sum, d) => sum + d.vat, 0),
          totalInheritance: details.reduce((sum, d) => sum + d.inheritance, 0),
          totalInheritanceTax: details.reduce((sum, d) => sum + d.inheritanceTax, 0),
          totalSpending: details.reduce((sum, d) => sum + d.spending, 0),
          totalSavings: details.reduce((sum, d) => sum + (d.income - d.spending), 0),
          totalSpendingFromWealth: details.reduce((sum, d) => sum + (d.spending * 0.3), 0),
          totalSpendingFromIncome: details.reduce((sum, d) => sum + (d.spending * 0.7), 0),
          totalTax: details.reduce((sum, d) => sum + d.tax, 0),
          totalTaxWithVAT: details.reduce((sum, d) => sum + d.tax + d.vat, 0),
          totalWealthGrowth: details.reduce((sum, d) => sum + d.wealthGrowth, 0)
        },
        details
      }
    })
  }

  return data
}

function PersonaLandscapeContent() {
  const [data, setData] = useState<PersonaCollectionStats[]>([])
  const { selectedTaxScenario } = useTaxScenario()

  // Define the time range
  const startYear = 2000
  const endYear = 2045

  useEffect(() => {
    if (personas.length > 0) {
      // Generate sample data with the current tax scenario
      const sampleData = GenerateSampleData(personas, startYear, endYear, selectedTaxScenario)
      setData(sampleData)
    }
  }, [personas, selectedTaxScenario])

  if (personas.length === 0 || data.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Persona Landscape Visualization</h1>
      <p className="text-muted-foreground mb-6">
        This visualization shows how different personas' wealth, income, and tax metrics evolve over time. Toggle
        between 3D and 2D views, and select different metrics to explore the data.
      </p>

      <TaxScenarioNavigation />
      <div className="mt-6">
        <PersonaCollectionOverTime
          personas={personas}
          personaStats={data}
          taxScenario={selectedTaxScenario}
        />
      </div>
    </div>
  )
}

export default function PersonaLandscapePage() {
  return (
    <TaxScenarioProvider>
      <PersonaLandscapeContent />
    </TaxScenarioProvider>
  )
}


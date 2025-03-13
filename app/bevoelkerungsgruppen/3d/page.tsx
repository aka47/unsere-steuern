"use client"

import { useState, useEffect } from "react"
import { PersonaCollectionOverTime } from "@/components/visualizations/persona-collection-over-time"
import { grokPersonas as personas, Persona } from "@/types/persona"
import { TaxScenarioNavigation } from "@/components/tax-scenarios/tax-scenario-navigation"
import { TaxScenarioProvider, useTaxScenario } from "@/hooks/useTaxScenario"
import { TaxScenario } from "@/types/life-income"
import { useLifeIncomeCalculator } from "@/hooks/useLifeIncomeCalculator"


// Sample data generator function
function GenerateSampleData(personas: Persona[], startYear: number, endYear: number, taxScenario: TaxScenario) {
  const data = []
  const { calculateLifeIncome } = useLifeIncomeCalculator()

  for (const persona of personas) {
    // Base values that will be different for each persona
    const baseIncome = persona.currentIncome
    const baseWealth = baseIncome * 5

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

      // Calculate effective tax rate from totals
      const totals = calculationResult?.totals || { totalIncomeTax: 0, totalIncome: 0 }
      const taxRate = totals.totalIncome > 0 ? totals.totalIncomeTax / totals.totalIncome : 0.2
      const tax = income * taxRate

      data.push({
        year,
        personaId: persona.id,
        personaName: persona.name,
        wealth,
        income,
        tax,
        taxRate,
      })
    }
  }

  return data
}

function PersonaLandscapeContent() {
  const [data, setData] = useState<any[]>([])
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


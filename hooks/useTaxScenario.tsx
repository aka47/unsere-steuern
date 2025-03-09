"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { taxScenarios, defaultTaxScenario } from "@/constants/tax-scenarios"
import { TaxScenario } from "@/types/life-income"
import { useTaxScenarioCalculator } from "./useTaxScenarioCalculator"

type ScenarioStat = {
  name: string
  description: string
  totalTaxRevenue: number
  effectiveTaxRate: number
  wageTaxRevenue: number
  inheritanceTaxRevenue: number
}

const scenarioStats: Record<string, ScenarioStat> = {
  flat: {
    name: "Einheitssteuer",
    description: "Ein einfaches Modell: Jeder zahlt den gleichen Steuersatz von 16,13% auf Einkommen und Erbschaften.",
    totalTaxRevenue: 242_000_000_000,
    effectiveTaxRate: 0.1613,
    wageTaxRevenue: 177_430_000_000,
    inheritanceTaxRevenue: 64_570_000_000,
  },
  "progressive-flat": {
    name: "Progressive Einheitssteuer",
    description: "Wer mehr verdient, zahlt auch prozentual mehr Steuern - ähnlich wie im aktuellen System.",
    totalTaxRevenue: 242_000_000_000,
    effectiveTaxRate: 0.1613,
    wageTaxRevenue: 177_430_000_000,
    inheritanceTaxRevenue: 64_570_000_000,
  },
  "50es-tax-levels": {
    name: "Die Steuern unter Kanzler Adenauer",
    description: "Das Steuersystem der 50er Jahre, als Deutschland sein Wirtschaftswunder erlebte.",
    totalTaxRevenue: 342_000_000_000,
    effectiveTaxRate: 0.228,
    wageTaxRevenue: 231_000_000_000,
    inheritanceTaxRevenue: 111_000_000_000,
  },
  custom: {
    name: "Deine Steuer",
    description: "Gestalte dein eigenes Steuersystem",
    totalTaxRevenue: 242_000_000_000, // Default value, will be updated with actual results
    effectiveTaxRate: 0.1613, // Default value, will be updated with actual results
    wageTaxRevenue: 177_430_000_000, // Default value, will be updated with actual results
    inheritanceTaxRevenue: 64_570_000_000, // Default value, will be updated with actual results
  }
}

type ScenarioId = keyof typeof scenarioStats
type ScenarioContextType = {
  selectedScenarioId: ScenarioId
  setSelectedScenarioId: (scenarioId: ScenarioId) => void
  scenarioDetails: ScenarioStat
  selectedTaxScenario: TaxScenario
  customTaxParams: {
    incomeTax: {
      taxFreeAmount: number
      taxLevel: "lower" | "current" | "adenauer"
    }
    wealthTax: {
      taxFreeAmount: number
      taxRate: number
    }
    inheritanceTax: {
      taxFreeAmount: number
      taxLevel: "lower" | "current" | "higher"
    }
  }
  setCustomTaxParams: (params: ScenarioContextType["customTaxParams"]) => void
}

// Map scenario IDs from scenarioStats to tax scenario IDs
const scenarioIdMap: Record<ScenarioId, string> = {
  "flat": "flat-tax",
  "progressive-flat": "progressive-wealth-tax",
  "50es-tax-levels": "fiftys-tax",
  "custom": "custom"
}

const TaxScenarioContext = createContext<ScenarioContextType | undefined>(undefined)

export function TaxScenarioProvider({ children }: { children: ReactNode }) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<ScenarioId>("flat")
  const [customTaxParams, setCustomTaxParams] = useState<ScenarioContextType["customTaxParams"]>({
    incomeTax: {
      taxFreeAmount: 11000,
      taxLevel: "current"
    },
    wealthTax: {
      taxFreeAmount: 1000000,
      taxRate: 0.02
    },
    inheritanceTax: {
      taxFreeAmount: 400000,
      taxLevel: "current"
    }
  })

  const { calculateScenario, results } = useTaxScenarioCalculator()

  // Find the corresponding tax scenario object
  const getTaxScenario = (scenarioId: ScenarioId): TaxScenario => {
    const taxScenarioId = scenarioIdMap[scenarioId]
    return taxScenarios.find(scenario => scenario.id === taxScenarioId) || defaultTaxScenario
  }

  const value = {
    selectedScenarioId,
    setSelectedScenarioId,
    scenarioDetails: scenarioStats[selectedScenarioId],
    selectedTaxScenario: getTaxScenario(selectedScenarioId),
    customTaxParams,
    setCustomTaxParams
  }

  return (
    <TaxScenarioContext.Provider value={value}>
      {children}
    </TaxScenarioContext.Provider>
  )
}

export function useTaxScenario(): ScenarioContextType {
  const context = useContext(TaxScenarioContext)
  if (context === undefined) {
    throw new Error("useTaxScenario must be used within a TaxScenarioProvider")
  }
  return context
}


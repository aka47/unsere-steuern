"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { taxScenarios, defaultTaxScenario } from "@/constants/tax-scenarios"
import { TaxScenario } from "@/types/life-income"
import { useTaxScenarioCalculator } from "./useTaxScenarioCalculator"

type ScenarioStat = {
  name: string
  description: string
  totalIncomeTax: number
  totalVAT: number
  totalInheritanceTax: number
  effectiveTaxRate: number
  wageTaxRevenue: number
  inheritanceTaxRevenue: number
}

const scenarioStats: Record<string, ScenarioStat> = {
  flat: {
    name: "Einheitssteuer",
    description: "Ein einfaches Modell: Jeder zahlt den gleichen Steuersatz von 16,13% auf Einkommen und Erbschaften.",
    totalIncomeTax: 0,
    totalVAT: 0,
    totalInheritanceTax: 0,
    effectiveTaxRate: 0,
    wageTaxRevenue: 0,
    inheritanceTaxRevenue: 0
  },
  "progressive-flat": {
    name: "Progressive Einheitssteuer",
    description: "Wer mehr verdient, zahlt auch prozentual mehr Steuern - ähnlich wie im aktuellen System.",
    totalIncomeTax: 0,
    totalVAT: 0,
    totalInheritanceTax: 0,
    effectiveTaxRate: 0,
    wageTaxRevenue: 0,
    inheritanceTaxRevenue: 0
  },
  "50es-tax-levels": {
    name: "Die Steuern unter Kanzler Adenauer",
    description: "Das Steuersystem der 50er Jahre, als Deutschland sein Wirtschaftswunder erlebte.",
    totalIncomeTax: 0,
    totalVAT: 0,
    totalInheritanceTax: 0,
    effectiveTaxRate: 0,
    wageTaxRevenue: 0,
    inheritanceTaxRevenue: 0
  },
  custom: {
    name: "Deine Steuer",
    description: "Gestalte dein eigenes Steuersystem",
    totalIncomeTax: 0,
    totalVAT: 0,
    totalInheritanceTax: 0,
    effectiveTaxRate: 0,
    wageTaxRevenue: 0,
    inheritanceTaxRevenue: 0
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

  // const { calculateScenario, results } = useTaxScenarioCalculator()

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


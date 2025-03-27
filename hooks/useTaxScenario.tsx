"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { taxScenarios, defaultTaxScenario, incomeTaxLevels, wealthTaxLevels, vatLevels, wealthIncomeTaxLevels } from "@/constants/tax-scenarios"
import { TaxScenario } from "@/types/life-income"
import { useTaxScenarioCalculator } from "./useTaxScenarioCalculator"
import { INHERITANCE_TAX_CLASSES } from "@/constants/tax"

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

export interface TaxParams {
  incomeTax: {
    taxLevel: keyof typeof incomeTaxLevels
  }
  wealthTax: {
    taxLevel: keyof typeof wealthTaxLevels
  }
  inheritanceTax: {
    taxLevel: keyof typeof INHERITANCE_TAX_CLASSES
    taxFreeAmount: number
  }
  wealthIncomeTax: {
    taxLevel: keyof typeof wealthIncomeTaxLevels
  }
  vatTax: {
    taxLevel: keyof typeof vatLevels
  }
}

interface TaxScenarioContextType {
  selectedTaxScenario: TaxScenario
  selectedScenarioId: string
  setSelectedScenarioId: (id: string) => void
  taxParams: TaxParams
  setTaxParams: React.Dispatch<React.SetStateAction<TaxParams>>
}

const defaultTaxParams: TaxParams = {
  incomeTax: {
    taxLevel: "status-quo"
  },
  wealthTax: {
    taxLevel: "status-quo"
  },
  inheritanceTax: {
    taxLevel: 1,
    taxFreeAmount: 400000
  },
  wealthIncomeTax: {
    taxLevel: "status-quo"
  },
  vatTax: {
    taxLevel: "status-quo"
  }
}

const TaxScenarioContext = createContext<TaxScenarioContextType | undefined>(undefined)

export function TaxScenarioProvider({ children }: { children: ReactNode }) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("status-quo")
  const [taxParams, setTaxParams] = useState<TaxParams>(defaultTaxParams)

  // Map the selectedScenarioId to the correct tax scenario ID
  const mappedScenarioId = scenarioIdMap[selectedScenarioId as keyof typeof scenarioIdMap] || selectedScenarioId
  const selectedTaxScenario = taxScenarios.find(scenario => scenario.id === mappedScenarioId) || taxScenarios[0]

  return (
    <TaxScenarioContext.Provider value={{
      selectedTaxScenario,
      selectedScenarioId,
      setSelectedScenarioId,
      taxParams,
      setTaxParams
    }}>
      {children}
    </TaxScenarioContext.Provider>
  )
}

export function useTaxScenario() {
  const context = useContext(TaxScenarioContext)
  if (context === undefined) {
    throw new Error("useTaxScenario must be used within a TaxScenarioProvider")
  }
  return context
}


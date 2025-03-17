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

interface TaxParams {
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
  wealthIncomeTax: {
    taxRate: number
  }
}

interface TaxScenarioContextType {
  selectedTaxScenario: TaxScenario
  selectedScenarioId: string
  setSelectedScenarioId: (id: string) => void
  taxParams: TaxParams
  setTaxParams: (params: TaxParams) => void
}

const defaultTaxParams: TaxParams = {
  incomeTax: {
    taxFreeAmount: 11000,
    taxLevel: "current"
  },
  wealthTax: {
    taxFreeAmount: 1000000,
    taxRate: 0
  },
  inheritanceTax: {
    taxFreeAmount: 400000,
    taxLevel: "current"
  },
  wealthIncomeTax: {
    taxRate: 0.10
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


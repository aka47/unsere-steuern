"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

const scenarios = {
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
  "no-exceptions": {
    name: "Die heutigen Steuern, weniger Ausnahmen",
    description: "Das aktuelle Steuersystem wird auf alle Geldzugänge angewendet - egal ob Arbeitslohn oder Erbschaft.",
    totalTaxRevenue: 342_000_000_000,
    effectiveTaxRate: 0.228,
    wageTaxRevenue: 231_000_000_000,
    inheritanceTaxRevenue: 111_000_000_000,
  },
  "loophole-removal": {
    name: "Die heutigen Steuern, keine Ausnahmen",
    description: "Ein modernisiertes Steuersystem, das die Steuerlast für Arbeitnehmer um 100 Milliarden Euro senkt.",
    totalTaxRevenue: 142_000_000_000,
    effectiveTaxRate: 0.0947,
    wageTaxRevenue: 131_000_000_000,
    inheritanceTaxRevenue: 11_000_000_000,
  },
} as const

type ScenarioId = keyof typeof scenarios
type ScenarioContextType = {
  selectedScenario: ScenarioId
  setSelectedScenario: (scenario: ScenarioId) => void
  scenarioDetails: typeof scenarios[ScenarioId]
}

const TaxScenarioContext = createContext<ScenarioContextType | undefined>(undefined)

export function TaxScenarioProvider({ children }: { children: ReactNode }) {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>("flat")

  const value = {
    selectedScenario,
    setSelectedScenario,
    scenarioDetails: scenarios[selectedScenario],
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


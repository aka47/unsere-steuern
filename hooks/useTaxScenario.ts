"use client"

import { useState, useCallback } from "react"

const scenarios = {
  flat: {
    name: "Flat Tax",
    description: "All wage income and inheritance are taxed at a single, flat rate of 16.13%.",
    totalTaxRevenue: 242_000_000_000,
    effectiveTaxRate: 0.1613,
    wageTaxRevenue: 177_430_000_000,
    inheritanceTaxRevenue: 64_570_000_000,
  },
  "progressive-flat": {
    name: "Progressive Flat Tax",
    description: "Tax all income using a scaled version of the current progressive tax schedule.",
    totalTaxRevenue: 242_000_000_000,
    effectiveTaxRate: 0.1613,
    wageTaxRevenue: 177_430_000_000,
    inheritanceTaxRevenue: 64_570_000_000,
  },
  "no-exceptions": {
    name: "Tax System Without Exceptions",
    description: "Current wage tax structure with full taxation of inheritances.",
    totalTaxRevenue: 342_000_000_000,
    effectiveTaxRate: 0.228,
    wageTaxRevenue: 231_000_000_000,
    inheritanceTaxRevenue: 111_000_000_000,
  },
  "loophole-removal": {
    name: "Tax Loophole Removal",
    description: "Adjusted income tax rates to reduce wage tax revenue by €100 billion.",
    totalTaxRevenue: 142_000_000_000,
    effectiveTaxRate: 0.0947,
    wageTaxRevenue: 131_000_000_000,
    inheritanceTaxRevenue: 11_000_000_000,
  },
}

export function useTaxScenario() {
  const [selectedScenario, setSelectedScenario] = useState<keyof typeof scenarios>("flat")

  const setScenario = useCallback((scenario: keyof typeof scenarios) => {
    setSelectedScenario(scenario)
  }, [])

  return {
    selectedScenario,
    setSelectedScenario: setScenario,
    scenarioDetails: scenarios[selectedScenario],
  }
}


"use client"

import { useTaxScenario } from "@/hooks/useTaxScenario"
import { TaxScenarioDetails } from "./tax-scenario-details"
import { TaxScenarioBuilder } from "@/components/tax/tax-scenario-builder"

export function TaxScenarioBuilderOrDetails() {
  const { selectedScenarioId } = useTaxScenario()

  return (
    <div>
      {selectedScenarioId === "custom" ? (
        <TaxScenarioBuilder />
      ) : (
        <TaxScenarioDetails />
      )}
    </div>
  )
}
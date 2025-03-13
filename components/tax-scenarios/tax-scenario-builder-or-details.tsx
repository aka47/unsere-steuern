"use client"

import { useTaxScenario } from "@/hooks/useTaxScenario"
import { TaxScenarioDetails } from "./tax-scenario-details"
import { TaxScenarioBuilder } from "@/components/tax/tax-scenario-builder"

export function TaxScenarioBuilderOrDetails() {
  const { selectedScenarioId } = useTaxScenario()

  return (
    <div>
      {selectedScenarioId === "custom" ? (
        <TaxScenarioBuilder simulation={{
          params: {
            incomeTaxMultiplier: 1,
            vatRate: 0.19,
            wealthTaxRate: 0.02,
            wealthIncomeTaxRate: 0.25
          },
          result: {
            incomeTax: 0,
            vat: 0,
            wealthTax: 0,
            wealthIncomeTax: 0,
            total: 0
          }
        }} />
      ) : (
        <TaxScenarioDetails
          simulation={{
            incomeTax: 0,
            vat: 0,
            wealthTax: 0,
            wealthIncomeTax: 0,
            total: 0
          }}
        />
      )}
    </div>
  )
}
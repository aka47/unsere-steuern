"use client"

import { useTaxScenario } from "@/hooks/useTaxScenario"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Markdown from "react-markdown"
import { TaxDistribution } from "@/types/life-income"

interface TaxScenarioDetailsProps {
  simulation: TaxDistribution
}

export function TaxScenarioDetails({ simulation }: TaxScenarioDetailsProps) {
  const { selectedTaxScenario } = useTaxScenario()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{selectedTaxScenario.name}</CardTitle>
          <CardDescription>{selectedTaxScenario.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Gesamtsteuern</h3>
              <p className="text-2xl font-bold">
                {(simulation.total / 1_000_000_000).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 1,
                })}
                <span className="text-sm font-normal"> Mrd.</span>
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Einkommensteuer</h3>
              <p className="text-2xl font-bold">
                {(simulation.incomeTax / 1_000_000_000).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 1,
                })}
                <span className="text-sm font-normal"> Mrd.</span>
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Mehrwertsteuer</h3>
              <p className="text-2xl font-bold">
                {(simulation.vat / 1_000_000_000).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 1,
                })}
                <span className="text-sm font-normal"> Mrd.</span>
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Vermögenssteuer</h3>
              <p className="text-2xl font-bold">
                {(simulation.wealthTax / 1_000_000_000).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 1,
                })}
                <span className="text-sm font-normal"> Mrd.</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTaxScenario.detailedDescription && (
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="no-tailwindcss-base max-w-none">
            <Markdown>{selectedTaxScenario.detailedDescription}</Markdown>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
"use client"

import { useTaxScenario } from "@/hooks/useTaxScenario"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { TaxDistribution } from "@/types/life-income"
import React, { useEffect } from "react"
import Markdown from "react-markdown"
import { StatCard } from "@/components/ui/stat-card"
import { WarningBox } from "@/components/warning-box"
import { useTaxScenarioCalculator } from "@/hooks/useTaxScenarioCalculator"

export function TaxScenarioDetails() {
  const { selectedTaxScenario, taxParams } = useTaxScenario()
  const [isOpen, setIsOpen] = React.useState(false)
  const { calculateScenario, results } = useTaxScenarioCalculator()

  // Calculate the scenario when the component mounts or when taxParams changes
  useEffect(() => {
    if (selectedTaxScenario.id === "custom") {
      calculateScenario(taxParams)
    }
  }, [calculateScenario, taxParams, selectedTaxScenario.id])

  return (
    <div className="space-y-6">
      <WarningBox header="Steuerrechner ist noch im entstehen!" description="Die hier dargestellten Berechnungen und Zahlen sind noch nicht vollständig, die Zahlen sind noch nicht 100% korrekt und die Berechnungen fehlen noch viele der Ausnahmen und Sonderfälle, welche uns Millarden kosten und keiner wirklich verstehen soll. Das ist bis heute auch sehr gut gelungen." />
      <Card>
        <CardHeader>
          <CardTitle>{selectedTaxScenario.name}</CardTitle>
          <CardDescription>{selectedTaxScenario.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {results && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Gesamtsteuern"
                value={((results.totals.totalIncomeTax + results.totals.totalVAT +
                        results.totals.totalWealthTax + results.totals.totalWealthIncomeTax)).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 1,
                })}
                suffix=" Mrd."
              />
              <StatCard
                title="Einkommensteuer"
                value={(results.totals.totalIncomeTax).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 1,
                })}
                suffix=" Mrd."
              />
              <StatCard
                title="Mehrwertsteuer"
                value={(results.totals.totalVAT).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 1,
                })}
                suffix=" Mrd."
              />
              <StatCard
                title="Vermögenssteuer"
                value={(results.totals.totalWealthTax).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 1,
                })}
                suffix=" Mrd."
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full flex justify-between items-center">
                <CardTitle>Details</CardTitle>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="no-tailwindcss-base max-w-none">
                <Markdown>{selectedTaxScenario.detailedDescription}</Markdown>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </CardHeader>
      </Card>
    </div>
  )
}
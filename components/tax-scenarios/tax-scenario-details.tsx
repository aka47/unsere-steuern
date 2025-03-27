"use client"

import { useTaxScenario } from "@/hooks/useTaxScenario"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { TaxDistribution, type TaxScenario } from "@/types/life-income"
import React, { useEffect, useState } from "react"
import Markdown from "react-markdown"
import { StatCard } from "@/components/ui/stat-card"
import { useTaxScenarioCalculator } from "@/hooks/useTaxScenarioCalculator"
import { type LifeIncomeCalculatorResult } from "@/hooks/useLifeIncomeCalculator"
import { taxScenarios } from "@/constants/tax-scenarios"
import { grokPersonasCollection } from "@/types/personaCollection"
import { PersonaCollection } from "@/types/personaCollection"
import { Persona } from "@/types/persona"
import { formatCurrency } from "@/lib/utils"

interface TaxScenarioDetailsProps {
  collection?: PersonaCollection
  usePersonaSize?: boolean
}

export function TaxScenarioDetails({ collection, usePersonaSize = true }: TaxScenarioDetailsProps) {
  const { selectedTaxScenario, taxParams } = useTaxScenario()
  const [isOpen, setIsOpen] = React.useState(false)
  const { calculateScenario, results } = useTaxScenarioCalculator(undefined, collection, usePersonaSize)
  const statusQuoScenario = taxScenarios.find(s => s.id === "status-quo")!
  const { calculateScenario: calculateStatusQuo } = useTaxScenarioCalculator(statusQuoScenario, collection, usePersonaSize)
  const [statusQuoResults, setStatusQuoResults] = useState<LifeIncomeCalculatorResult | null>(null)

  useEffect(() => {
    // Always calculate status quo results unless we're viewing status quo
    if (selectedTaxScenario.id === "status-quo") {
      setStatusQuoResults(null)
    } else {
      const results = calculateStatusQuo(taxParams)
      setStatusQuoResults(results)
    }
    calculateScenario(taxParams)
  }, [selectedTaxScenario.id, taxParams, collection])

  const formatDifference = (current: number, baseline: number): string | undefined => {
    const diff = current - baseline
    if (diff === 0) return undefined

    const percentage = (diff / baseline) * 100
    const formattedDiff = formatCurrency(Math.abs(diff))
    const formattedPercentage = Math.abs(percentage).toFixed(1)
    const color = diff > 0 ? "text-green-600" : "text-red-600"
    const arrow = diff > 0 ? "↑" : "↓"

    return `${arrow} ${formattedDiff} (${formattedPercentage}%)`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{selectedTaxScenario.name}</CardTitle>
          <CardDescription>{selectedTaxScenario.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {results && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
              <StatCard
                title="Gesamtsteuern"
                description={selectedTaxScenario.taxSummary?.totalTax}
                value={formatCurrency(results.totals.totalTaxWithVAT)}
                suffix=""
                content={(statusQuoResults && formatDifference(
                  results.totals.totalTaxWithVAT,
                  statusQuoResults.totals.totalTaxWithVAT
                )) ?? undefined}
              />
              <StatCard
                title="Einkommensteuer"
                value={formatCurrency(results.totals.totalIncomeTax)}
                suffix=""
                description={selectedTaxScenario.taxSummary?.incomeTax}
                content={(statusQuoResults && formatDifference(
                  results.totals.totalIncomeTax,
                  statusQuoResults.totals.totalIncomeTax
                )) ?? undefined}
              />
              <StatCard
                title="Erbschaftsteuer"
                value={formatCurrency(results.totals.totalInheritanceTax)}
                suffix=""
                description={selectedTaxScenario.taxSummary?.inheritanceTax}
                content={(statusQuoResults && formatDifference(
                  results.totals.totalInheritanceTax,
                  statusQuoResults.totals.totalInheritanceTax
                )) ?? undefined}
              />
              <StatCard
                title="Kapitalertragsteuer"
                value={formatCurrency(results.totals.totalWealthIncomeTax)}
                suffix=""
                description={selectedTaxScenario.taxSummary?.wealthIncomeTax}
                content={(statusQuoResults && formatDifference(
                  results.totals.totalWealthIncomeTax,
                  statusQuoResults.totals.totalWealthIncomeTax
                )) ?? undefined}
              />
              <StatCard
                title="Vermögenssteuer"
                value={formatCurrency(results.totals.totalWealthTax)}
                suffix=""
                description={selectedTaxScenario.taxSummary?.wealthTax}
                content={(statusQuoResults && formatDifference(
                  results.totals.totalWealthTax,
                  statusQuoResults.totals.totalWealthTax
                )) ?? undefined}
              />
              <StatCard
                title="Mehrwertsteuer"
                value={formatCurrency(results.totals.totalVAT)}
                suffix=""
                description={selectedTaxScenario.taxSummary?.vatTax}
                content={(statusQuoResults && formatDifference(
                  results.totals.totalVAT,
                  statusQuoResults.totals.totalVAT
                )) ?? undefined}
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
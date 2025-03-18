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

export function TaxScenarioDetails() {
  const { selectedTaxScenario, taxParams } = useTaxScenario()
  const [isOpen, setIsOpen] = React.useState(false)
  const { calculateScenario, results } = useTaxScenarioCalculator()
  const statusQuoScenario = taxScenarios.find(s => s.id === "status-quo")!
  const { calculateScenario: calculateStatusQuo } = useTaxScenarioCalculator(statusQuoScenario)
  const [statusQuoResults, setStatusQuoResults] = useState<LifeIncomeCalculatorResult | null>(null)


  useEffect(() => {
    // Always calculate status quo results unless we're viewing status quo
    // if (selectedTaxScenario.id === "status-quo") {
    //   setStatusQuoResults(null)
    // } else {
    //   const results = calculateStatusQuo(taxParams)
    //   setStatusQuoResults(results)
    // }
    calculateScenario(taxParams)
  }, [selectedTaxScenario.id, taxParams])

  const formatDifference = (current: number, baseline: number) => {
    const diff = current - baseline
    const percentage = (diff / baseline) * 100
    const formattedDiff = Math.abs(diff).toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 1,
    })
    const formattedPercentage = Math.abs(percentage).toFixed(1)

    if (diff === 0) return null

    const color = diff > 0 ? "text-green-600" : "text-red-600"
    const arrow = diff > 0 ? "↑" : "↓"

    return (
      <div className={`${color}`}>
        {arrow} {formattedDiff} Mrd. ({formattedPercentage}%)
      </div>
    )
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
                value={((results.totals.totalTaxWithVAT)).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 1,
                })}
                suffix=""
                description={statusQuoResults && formatDifference(
                  results.totals.totalTaxWithVAT,
                  statusQuoResults.totals.totalTaxWithVAT
                )}
              />
              <StatCard
                title="Einkommensteuer"
                value={(results.totals.totalIncomeTax).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 1,
                })}
                suffix=""
                description={statusQuoResults && formatDifference(
                  results.totals.totalIncomeTax,
                  statusQuoResults.totals.totalIncomeTax
                )}
              />
              <StatCard
                title="Erbschaftsteuer"
                value={(results.totals.totalInheritanceTax).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 1,
                })}
                suffix=""
                description={statusQuoResults && formatDifference(
                  results.totals.totalInheritanceTax,
                  statusQuoResults.totals.totalInheritanceTax
                )}
              />
              <StatCard
                title="Kapitalertragsteuer"
                value={(results.totals.totalWealthIncomeTax).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 1,
                })}
                suffix=""
                description={statusQuoResults && formatDifference(
                  results.totals.totalWealthIncomeTax,
                  statusQuoResults.totals.totalWealthIncomeTax
                )}
              />
              <StatCard
                title="Vermögenssteuer"
                value={(results.totals.totalWealthTax).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 1,
                })}
                suffix=""
                description={statusQuoResults && formatDifference(
                  results.totals.totalWealthTax,
                  statusQuoResults.totals.totalWealthTax
                )}
              />
                <StatCard
                title="Mehrwertsteuer"
                value={(results.totals.totalVAT).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 1,
                })}
                suffix=""
                description={statusQuoResults && formatDifference(
                  results.totals.totalVAT,
                  statusQuoResults.totals.totalVAT
                )}
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
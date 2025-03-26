"use client"

import React, { useEffect, useState } from "react"
import { useTaxScenario } from "@/hooks/useTaxScenario"
import { PersonaYearlyAverage } from "@/components/visualizations/persona-yearly-average"
import { PersonaCollectionOverTime } from "@/components/visualizations/persona-collection-over-time"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePersonaCollectionCalculator } from "@/hooks/usePersonaCollectionCalculations"
import { Persona } from "@/types/persona"
import { StatCard } from "@/components/ui/stat-card"
import { PersonaCollection } from "@/types/personaCollection"
import { Button } from "@/components/ui/button"
import { validatePersonaCollection, formatValidationResults } from "@/lib/personaCollectionValidator"

interface PersonaGroupStatsProps {
  collection: PersonaCollection
}

export function PersonaGroupStats({ collection }: PersonaGroupStatsProps) {
  const { selectedTaxScenario } = useTaxScenario()
  const { personaStats } = usePersonaCollectionCalculator(collection, selectedTaxScenario)
  const [validationResults, setValidationResults] = useState<string | null>(null)

  useEffect(() => {
    // This effect will run whenever selectedTaxScenario changes
    // The usePersonaCollectionCalculator hook will recalculate with the new scenario
  }, [selectedTaxScenario])

  const handleValidate = () => {
    const results = validatePersonaCollection(collection)
    setValidationResults(formatValidationResults(results))
  }

  const formatValue = (value: number, type: "currency" | "percentage" | "number") => {
    if (type === "currency") {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    }
    if (type === "percentage") {
      return new Intl.NumberFormat("de-DE", {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value / 100)
    }
    return new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-4">
      {/* <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gruppenstatistik</h2>
        <Button onClick={handleValidate}>Validate Collection</Button>
      </div>

      {validationResults && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {validationResults}
          </pre>
        </div>
      )} */}

      <Tabs defaultValue="over-time" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="over-time">Entwicklung über die Zeit</TabsTrigger>
          <TabsTrigger value="yearly">Jährliche Durchschnitte</TabsTrigger>
        </TabsList>
        <TabsContent value="over-time">
          <PersonaCollectionOverTime personas={collection.personas} personaStats={personaStats} taxScenario={selectedTaxScenario} />
        </TabsContent>
        <TabsContent value="yearly">
          <PersonaYearlyAverage personas={collection.personas} personaStats={personaStats} />
        </TabsContent>
      </Tabs>

      {false && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Gesamtsteuern"
            value={formatValue(personaStats.reduce((total, stats) => total + stats.totalTaxPaid, 0), "currency")}
            description="Summe aller Steuern"
          />
          <StatCard
            title="Gesamteinkommen"
            value={formatValue(personaStats.reduce((total, stats) => total + stats.totalIncomeReceived, 0), "currency")}
            description="Summe aller Einkommen"
          />
          <StatCard
            title="Gesamtvermögen"
            value={formatValue(personaStats.reduce((total, stats) => total + stats.totalWealth, 0), "currency")}
            description="Summe aller Vermögen"
          />
          <StatCard
            title="Durchschnittlicher Steuersatz"
            value={formatValue(personaStats.reduce((total, stats) => total + stats.totalTaxPaid, 0) / personaStats.length * 100, "percentage")}
            suffix="%"
            description="Durchschnittlicher Steuersatz"
          />
        </div>
      )}
    </div>
  )
}
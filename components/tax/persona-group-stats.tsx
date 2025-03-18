"use client"

import { usePersonaSegmentCollectionCalculator } from "@/hooks/usePersonaSegmentCalculator"
import { Persona } from "@/types/persona"
import React, { useEffect, useState } from "react"
import { useTaxScenario } from "@/hooks/useTaxScenario"
import { PersonaYearlyAverage } from "@/components/visualizations/persona-yearly-average"
import { PersonaCollectionOverTime } from "@/components/visualizations/persona-collection-over-time"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard } from "@/components/ui/stat-card"

export function PersonaGroupStats({ personas }: { personas: Persona[] }) {
  const { selectedTaxScenario } = useTaxScenario()
  const { personaStats } = usePersonaSegmentCollectionCalculator(personas, selectedTaxScenario)

  // Force recalculation when tax scenario changes
  const [key, setKey] = useState(0)
  useEffect(() => {
    setKey(prev => prev + 1)
  }, [selectedTaxScenario])

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
    <div className="space-y-6">
      <Tabs defaultValue="yearly" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="yearly">Jährliche Durchschnitte</TabsTrigger>
          <TabsTrigger value="over-time">Entwicklung über die Zeit</TabsTrigger>
        </TabsList>
        <TabsContent value="over-time">
          <PersonaCollectionOverTime key={key} personas={personas} personaStats={personaStats} taxScenario={selectedTaxScenario} />
        </TabsContent>
        <TabsContent value="yearly">
          <PersonaYearlyAverage key={key} personas={personas} personaStats={personaStats} />
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
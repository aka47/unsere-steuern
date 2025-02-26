"use client"

import { useState } from "react"
import { LifeIncomeCalculator } from "@/components/life-income/life-income-calculator"
import { LifeIncomeResults } from "@/components/life-income/life-income-results"
import { type Persona } from "@/types/persona"
import { type LifeIncomeResults as LifeIncomeResultsType } from "@/types/life-income"
import { PageHeader } from "@/components/ui/page-header"
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent
} from "@/components/ui/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui"

export default function LifeIncomeCalculatorPage() {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [results, setResults] = useState<LifeIncomeResultsType>(null)

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Lebenseinkommen-Rechner"
        subtitle="Berechnen Sie Ihr persönliches Lebenseinkommen und erfahren Sie, wie sich verschiedene Faktoren auf Ihre finanzielle Zukunft auswirken."
      />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Calculator Column */}
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle>Ihre Daten</CardTitle>
              <CardDescription>Geben Sie Ihre persönlichen Daten ein</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <LifeIncomeCalculator
                setResults={setResults}
                selectedPersona={selectedPersona}
                setSelectedPersona={setSelectedPersona}
              />
            </CardContent>
          </Card>

          {/* Results Column */}
          {results && (
            <div className="space-y-6">
              <LifeIncomeResults
                results={results}
                setResults={setResults}
                selectedPersona={selectedPersona}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
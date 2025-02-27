"use client"

import { useState } from "react"
import { LifeIncomeCalculator } from "@/components/life-income/life-income-calculator"
import { type Persona } from "@/types/persona"
import { type LifeIncomeResults as _LifeIncomeResultsType } from "@/types/life-income"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui"

export default function LifeIncomeCalculatorPage() {
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null)
  const [_results, setResults] = useState<_LifeIncomeResultsType>(null)

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Lebenseinkommen-Rechner"
        subtitle="Berechnen Sie Ihr persönliches Lebenseinkommen und erfahren Sie, wie sich verschiedene Faktoren auf Ihre finanzielle Zukunft auswirken."
      />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="grid gap-8 lg:grid-cols-1">
          {/* Calculator Column */}
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle>Ihre Daten</CardTitle>
              <CardDescription>Geben Sie Ihre persönlichen Daten ein</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">

            </CardContent>
          </Card>
          <LifeIncomeCalculator
                setResults={setResults}
                currentPersona={currentPersona}
                setCurrentPersona={setCurrentPersona}
              />

          {/* {results && (
            <div className="space-y-6">
              <LifeIncomeResults
                results={results}
                setResults={setResults}
                currentPersona={currentPersona}
              />
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}
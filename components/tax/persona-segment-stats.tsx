"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePersonaSegmentCollectionCalculator } from "@/hooks/usePersonaSegmentCalculator"
import { TaxRevenueChart } from "./tax-revenue-chart"
import { PersonaGroupStats } from "./persona-group-stats"
import { Persona } from "@/types/persona"

interface PersonaSegmentStatsProps {
  personas: Persona[]
}

export function PersonaSegmentStats({ personas }: PersonaSegmentStatsProps) {
  const {aggregatedStats} = usePersonaSegmentCollectionCalculator(personas)

  if (!aggregatedStats) return null

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Gesamtbevölkerung</h2>
        <TaxRevenueChart data={aggregatedStats.taxDistribution} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gesamtsteuern</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {(aggregatedStats.taxDistribution.total / 1e9).toFixed(1)} Mrd. €
              </p>
              <p className="text-sm text-muted-foreground">
                Durchschnittlicher Steuersatz: {(aggregatedStats.averageTaxRate * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gesamteinkommen</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {(aggregatedStats.totalIncomeReceived / 1e9).toFixed(1)} Mrd. €
              </p>
              <p className="text-sm text-muted-foreground">
                Einkommensteuer: {(aggregatedStats.averageIncomeTaxRate * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gesamtvermögen</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {(aggregatedStats.totalWealth / 1e9).toFixed(1)} Mrd. €
              </p>
              <p className="text-sm text-muted-foreground">
                Vermögensteuer: {(aggregatedStats.averageWealthTaxRate * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bevölkerung</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {aggregatedStats.populationSize.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Gesamte deutsche Bevölkerung
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Steueraufkommen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Einkommensteuer:</span>
                  <span className="font-medium">{(aggregatedStats.taxDistribution.incomeTax / 1e9).toFixed(1)} Mrd. €</span>
                </div>
                <div className="flex justify-between">
                  <span>Mehrwertsteuer:</span>
                  <span className="font-medium">{(aggregatedStats.taxDistribution.vat / 1e9).toFixed(1)} Mrd. €</span>
                </div>
                <div className="flex justify-between">
                  <span>Vermögensteuer:</span>
                  <span className="font-medium">{(aggregatedStats.taxDistribution.wealthTax / 1e9).toFixed(1)} Mrd. €</span>
                </div>
                <div className="flex justify-between">
                  <span>Kapitalertragssteuer:</span>
                  <span className="font-medium">{(aggregatedStats.taxDistribution.wealthIncomeTax / 1e9).toFixed(1)} Mrd. €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weitere Kennzahlen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Erbschaften:</span>
                  <span className="font-medium">{(aggregatedStats.totalInheritanceReceived / 1e9).toFixed(1)} Mrd. €</span>
                </div>
                <div className="flex justify-between">
                  <span>Mehrwertsteuer:</span>
                  <span className="font-medium">{(aggregatedStats.totalVATPaid / 1e9).toFixed(1)} Mrd. €</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Statistiken pro Bevölkerungsgruppe</h2>
        <PersonaGroupStats personas={personas} />
      </div>
    </div>
  )
}
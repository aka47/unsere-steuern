"use client"

import { useTaxScenario } from "@/hooks/useTaxScenario"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ScenarioSummary() {
  // eslint-disable-next-line
  const { selectedScenario, scenarioDetails } = useTaxScenario()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Tax Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{scenarioDetails.totalTaxRevenue.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Effective Tax Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(scenarioDetails.effectiveTaxRate * 100).toFixed(2)}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Wage Tax Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{scenarioDetails.wageTaxRevenue.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Inheritance Tax Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{scenarioDetails.inheritanceTaxRevenue.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  )
}


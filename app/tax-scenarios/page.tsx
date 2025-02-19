import { Suspense } from "react"
import { TaxScenarioSelector } from "@/components/tax-scenarios/tax-scenario-selector"
import { PersonaSimulationList } from "@/components/tax-scenarios/persona-simulation-list"
import { ScenarioSummary } from "@/components/tax-scenarios/scenario-summary"
import { DataSources } from "@/components/tax-scenarios/data-sources"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TaxScenariosPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Tax Scenarios: Lifetime Income, Wealth & Taxes</h1>
          <p className="text-muted-foreground max-w-3xl">
            This page simulates how different tax policy scenarios affect an individual&apos;s lifetime earnings, wealth
            build-up, and taxes paid. Using realistic data and predefined personas, we illustrate how policy changes can
            impact everyday lives across various demographics and income levels.
          </p>
        </div>

        {/* Tax Scenario Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Tax Scenario</CardTitle>
            <CardDescription>Choose a tax scenario to see its impact on different personas</CardDescription>
          </CardHeader>
          <CardContent>
            <TaxScenarioSelector />
          </CardContent>
        </Card>

        {/* Scenario Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Scenario Summary</CardTitle>
            <CardDescription>Key metrics for the selected tax scenario</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
              <ScenarioSummary />
            </Suspense>
          </CardContent>
        </Card>

        {/* Persona Simulations */}
        <Card>
          <CardHeader>
            <CardTitle>Persona Simulations</CardTitle>
            <CardDescription>
              Lifetime simulations for different personas under the selected tax scenario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <PersonaSimulationList />
            </Suspense>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <DataSources />
      </div>
    </div>
  )
}


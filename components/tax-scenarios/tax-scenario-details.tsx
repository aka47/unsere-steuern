"use client"

import { useState } from "react"
import { useTaxScenario } from "@/hooks/useTaxScenario"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { defaultTaxScenario } from "@/constants/tax-scenarios"
import Markdown from "react-markdown"
import { TaxScenarioBuilder } from "@/components/tax/tax-scenario-builder"
import { baseline, target, finalResult } from "@/constants/simulation"

export function TaxScenarioDetails() {
  const { selectedTaxScenario } = useTaxScenario()
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="mt-6">
      <Button
        variant="outline"
        onClick={() => setShowDetails(!showDetails)}
        className="mb-4"
      >
        {showDetails ? "Details ausblenden" : "Steuerdetails anzeigen"}
      </Button>

      {showDetails && (
        <Tabs defaultValue="selected">
          <TabsList className="mb-4">
            <TabsTrigger value="selected">{selectedTaxScenario.name}</TabsTrigger>
            {selectedTaxScenario.id !== defaultTaxScenario.id && (
              <TabsTrigger value="comparison">Vergleich mit Status Quo</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="selected">
            {selectedTaxScenario.id === "custom" ? (
              <TaxScenarioBuilder
                simulation={{
                  params: {
                    incomeTaxMultiplier: 1,
                    vatRate: 0.19,
                    wealthTaxRate: 0.02,
                    wealthIncomeTaxRate: 0.26375
                  },
                  result: finalResult
                }}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedTaxScenario.name} {selectedTaxScenario.id}</CardTitle>
                  <CardDescription>{selectedTaxScenario.description}</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  {selectedTaxScenario.detailedDescription ? (
                    <Markdown>{selectedTaxScenario.detailedDescription}</Markdown>
                  ) : (
                    <p>Keine detaillierten Informationen verfügbar.</p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {selectedTaxScenario.id !== defaultTaxScenario.id && (
            <TabsContent value="comparison">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedTaxScenario.name}</CardTitle>
                    <CardDescription>{selectedTaxScenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    {selectedTaxScenario.detailedDescription ? (
                      <Markdown>{selectedTaxScenario.detailedDescription}</Markdown>
                    ) : (
                      <p>Keine detaillierten Informationen verfügbar.</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{defaultTaxScenario.name}</CardTitle>
                    <CardDescription>{defaultTaxScenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    {defaultTaxScenario.detailedDescription ? (
                      <Markdown>{defaultTaxScenario.detailedDescription}</Markdown>
                    ) : (
                      <p>Keine detaillierten Informationen verfügbar.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  )
}
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { taxScenarios } from "@/constants/tax-scenarios"
import { type TaxScenario } from "@/types/life-income"

interface TaxScenarioSelectorProps {
  selectedScenario: TaxScenario
  onScenarioChange: (scenario: TaxScenario) => void
  onCompareScenarios: () => void
}

export function TaxScenarioSelector({
  selectedScenario,
  onScenarioChange,
  onCompareScenarios
}: TaxScenarioSelectorProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Steuer-Szenarien</CardTitle>
        <CardDescription>
          Wählen Sie ein Steuerszenario aus, um verschiedene Steuermodelle zu vergleichen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedScenario.id}
          onValueChange={(value: string) => {
            const scenario = taxScenarios.find((s) => s.id === value)
            if (scenario) {
              onScenarioChange(scenario)
            }
          }}
          className="space-y-4"
        >
          {taxScenarios.map((scenario) => (
            <div key={scenario.id} className="flex items-start space-x-2">
              <RadioGroupItem value={scenario.id} id={scenario.id} className="mt-1" />
              <div className="grid gap-1.5">
                <Label htmlFor={scenario.id} className="font-medium">
                  {scenario.name}
                </Label>
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>

        <Button
          onClick={onCompareScenarios}
          className="mt-6 w-full"
          variant="outline"
        >
          Szenarien vergleichen
        </Button>
      </CardContent>
    </Card>
  )
}
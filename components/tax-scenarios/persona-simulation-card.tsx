"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LifetimeChart } from "@/components/tax-scenarios/lifetime-chart"
import { useLifetimeSimulation } from "@/hooks/useLifetimeSimulation"
import type { Persona } from "@/types/persona"

interface PersonaSimulationCardProps {
  persona: Persona
  scenario: string
}

export function PersonaSimulationCard({ persona, scenario }: PersonaSimulationCardProps) {
  const simulation = useLifetimeSimulation(persona, scenario)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="text-2xl mr-2">{persona.icon}</span>
          {persona.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LifetimeChart data={simulation} />
        <div className="mt-4 text-sm">
          <p>Total Income: €{simulation.totalIncome.toLocaleString()}</p>
          <p>Total Wealth: €{simulation.totalWealth.toLocaleString()}</p>
          <p>Total Taxes Paid: €{simulation.totalTaxesPaid.toLocaleString()}</p>
          <p>Effective Tax Rate: {(simulation.effectiveTaxRate * 100).toFixed(2)}%</p>
        </div>
      </CardContent>
    </Card>
  )
}


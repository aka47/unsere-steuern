"use client"

import { PersonaSimulationCard } from "@/components/tax-scenarios/persona-simulation-card"
import { useTaxScenario } from "@/hooks/useTaxScenario"
import { initialPersonas } from "@/types/persona"

export function PersonaSimulationList() {
  const { selectedScenario } = useTaxScenario()

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {initialPersonas.map((persona) => (
        <PersonaSimulationCard key={persona.id} persona={persona} scenario={selectedScenario} />
      ))}
    </div>
  )
}


"use client"

import { useTaxScenario } from "@/hooks/useTaxScenario"
import { TaxScenarioDetails } from "./tax-scenario-details"
import { TaxScenarioBuilder } from "@/components/tax/tax-scenario-builder"
import { Persona } from "@/types/persona"
import { grokPersonasCollection } from "@/types/personaCollection"
import { PersonaCollection } from "@/types/personaCollection"

interface TaxScenarioBuilderOrDetailsProps {
  collection?: PersonaCollection
  usePersonaSize?: boolean
}

export function TaxScenarioBuilderOrDetails({ collection = grokPersonasCollection, usePersonaSize = false }: TaxScenarioBuilderOrDetailsProps) {
  const { selectedScenarioId } = useTaxScenario()

  return (
    <div>
      {selectedScenarioId === "custom" ? (
        <TaxScenarioBuilder collection={collection} usePersonaSize={usePersonaSize} />
      ) : (
        <TaxScenarioDetails collection={collection} usePersonaSize={usePersonaSize} />
      )}
    </div>
  )
}
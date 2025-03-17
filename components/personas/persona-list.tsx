import { TaxScenario } from "@/types/life-income"
import { PersonaCard } from "@/components/personas/persona-card"
import type { Persona } from "@/types/persona"

interface PersonaListProps {
  personas: Persona[]
  taxScenario: TaxScenario
  onPersonaClick: (persona: Persona) => void
}

export function PersonaList({ personas, taxScenario, onPersonaClick }: PersonaListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {personas.map((persona) => (
        <PersonaCard key={persona.id} persona={persona} taxScenario={taxScenario} onClick={() => onPersonaClick(persona)} />
      ))}
    </div>
  )
}


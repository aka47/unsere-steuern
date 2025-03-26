import { TaxScenario } from "@/types/life-income"
import { PersonaCard } from "@/components/personas/persona-card"
import type { Persona } from "@/types/persona"
import { PersonaCollection } from "@/types/personaCollection"

interface PersonaListProps {
  collection: PersonaCollection
  onPersonaClick?: (persona: Persona) => void
  taxScenario: TaxScenario
}

export function PersonaList({ collection, onPersonaClick = () => {}, taxScenario }: PersonaListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {collection.personas.map((persona) => (
        <PersonaCard key={persona.id} persona={persona} taxScenario={taxScenario} onClick={() => onPersonaClick(persona)} />
      ))}
    </div>
  )
}


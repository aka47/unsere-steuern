import { PersonaCard } from "./persona-card"
import type { Persona } from "@/types/persona"

interface PersonaListProps {
  personas: Persona[]
  onPersonaClick: (persona: Persona) => void
}

export function PersonaList({ personas, onPersonaClick }: PersonaListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {personas.map((persona) => (
        <PersonaCard key={persona.id} persona={persona} onClick={() => onPersonaClick(persona)} />
      ))}
    </div>
  )
}


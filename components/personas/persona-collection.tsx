import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PersonaList } from "@/components/personas/persona-list"
import type { PersonaCollection } from "@/types/personaCollection"
import type { Persona } from "@/types/persona"

interface PersonaCollectionProps {
  collection: PersonaCollection
  onPersonaClick?: (persona: Persona) => void
}

export function PersonaCollection({ collection, onPersonaClick = () => {} }: PersonaCollectionProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{collection.title}</CardTitle>
        <CardDescription>{collection.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <PersonaList personas={collection.personas} onPersonaClick={onPersonaClick} />
      </CardContent>
    </Card>
  )
}
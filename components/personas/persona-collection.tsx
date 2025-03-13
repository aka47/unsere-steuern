import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PersonaList } from "@/components/personas/persona-list"
import type { PersonaCollection } from "@/types/personaCollection"
import type { Persona } from "@/types/persona"
import { PersonaGroupStats } from "@/components/tax/persona-group-stats"
import { TypographyH2 } from "@/components/ui/typography"

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
        <PersonaGroupStats personas={collection.personas} />

        <TypographyH2 className="mt-12 mb-6">Wie wirken sich diese auf unser Vermögen, Einkommen und Steuerlast aus?</TypographyH2>

        <PersonaList personas={collection.personas} onPersonaClick={onPersonaClick} />
      </CardContent>
    </Card>
  )
}
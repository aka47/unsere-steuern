import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { PersonaCollection } from "@/types/personaCollection"
import type { Persona } from "@/types/persona"
import { PersonaGroupStats } from "@/components/tax/persona-group-stats"
import { TypographyH2 } from "@/components/ui/typography"
import { useTaxScenario } from "@/hooks/useTaxScenario"
import { PersonaList } from "./persona-list"

interface PersonaCollectionProps {
  collection: PersonaCollection
  onPersonaClick?: (persona: Persona) => void
}

export function PersonaCollection({ collection, onPersonaClick = () => {} }: PersonaCollectionProps) {
  const { selectedTaxScenario } = useTaxScenario()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{collection.title}</CardTitle>
        <CardDescription>{collection.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <PersonaGroupStats personas={collection.personas} />

        <TypographyH2 className="mt-12 mb-6">Wie wirken sich diese auf unser Vermögen, Einkommen und Steuerlast aus?</TypographyH2>

        <PersonaList personas={collection.personas} onPersonaClick={onPersonaClick} taxScenario={selectedTaxScenario} />
      </CardContent>
    </Card>
  )
}
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { PersonaCollection } from "@/types/personaCollection"
import type { Persona } from "@/types/persona"
import { PersonaGroupStats } from "@/components/tax/persona-group-stats"
import { TypographyH2 } from "@/components/ui/typography"
import { useTaxScenario } from "@/hooks/useTaxScenario"
import { PersonaList } from "./persona-list"
import { DismissibleBox } from "@/components/onboarding"

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
        <PersonaGroupStats collection={collection} />

        <TypographyH2 className="mt-12 mb-6">Wie wirken sich diese auf uns Menschen aus?</TypographyH2>
        <DismissibleBox className="max-w-6xl m-6" title="Die folgenden Personen/Haushalte spiegeln die realen Einkommens, Vermögens und Erbschaftverteilung in Deutschland wider.">
          <p>
            Die 42 Millionen Haushalte in Deutschland sind 100%. Unsere finanzielle Lebenrealität ist aber sehr unterschiedlich bis gegensätzlich.
            Was für den einen mehr Netto ist, muss der andere bezahlen. Somit haben wir diese 100% aufgeteilt in {collection.personas.length} Personen/Haushalte.
          </p>
        </DismissibleBox>

        <PersonaList collection={collection} onPersonaClick={onPersonaClick} taxScenario={selectedTaxScenario} />
      </CardContent>
    </Card>
  )
}
import { grokPersonasCollection } from "@/types/personaCollection"
import { PersonaCollectionStats } from "@/components/tax/persona-collection-stats"
import { PageHeader } from "@/components/ui"

export default function BevoelkerungPage() {
  return (
    <>
      <PageHeader
        title="Bevölkerungsstatistiken"
        subtitle="Diese Seite zeigt die aggregierten Steuer- und Einkommensstatistiken für 10% der deutschen Bevölkerung, basierend auf verschiedenen Personas."
      />
      <div className="container mx-auto px-4">
        <PersonaCollectionStats collection={grokPersonasCollection} />
      </div>
    </>
  )
}
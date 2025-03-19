import { PersonaCollectionStats } from "@/components/tax/persona-segment-stats"
import { PageHeader } from "@/components/ui"
import { grokPersonas } from "@/types/persona"

export default function BevoelkerungPage() {
  return (
    <>
      <PageHeader
        title="Bevölkerungsstatistiken"
        subtitle="Diese Seite zeigt die aggregierten Steuer- und Einkommensstatistiken für 10% der deutschen Bevölkerung, basierend auf verschiedenen Personas."
      />
      <div className="container mx-auto px-4">
        <PersonaCollectionStats personas={grokPersonas} />
      </div>
    </>
  )
}
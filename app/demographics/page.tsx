"use client"

import { PersonaCollection } from "@/components/personas/persona-collection"
import { PersonaCollectionStats } from "@/components/personas/persona-collection-stats"
import {
  initialPersonasCollection,
  avgPersonasCollection,
  highIncomePersonasCollection,
  hundredAvgPersonas
} from "@/types/personaCollection"
import { PageHeader } from "@/components/ui/page-header"

export default function DemographicsPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Bevölkerungsgruppen"
        subtitle="Übersicht verschiedener Bevölkerungsgruppen und ihrer Einkommensverteilung"
      />
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div>
          <PersonaCollection collection={initialPersonasCollection} />
          <PersonaCollectionStats collection={initialPersonasCollection} />
        </div>
        <div>
          <PersonaCollection collection={avgPersonasCollection} />
          <PersonaCollectionStats collection={avgPersonasCollection} />
        </div>

        <div>
          <PersonaCollection collection={highIncomePersonasCollection} />
          <PersonaCollectionStats collection={highIncomePersonasCollection} />
        </div>

        <div>
          <PersonaCollection collection={hundredAvgPersonas} />
          <PersonaCollectionStats collection={hundredAvgPersonas} />
        </div>
      </div>
    </div>
  )
}


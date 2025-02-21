"use client"

import { PersonaCollection } from "@/components/personas/PersonaCollection"
import { PersonaCollectionStats } from "@/components/personas/PersonaCollectionStats"
import {
  initialPersonasCollection,
  avgPersonasCollection,
  highIncomePersonasCollection,
  hundredAvgPersonas
} from "@/types/personaCollection"

export default function DemographicsPage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
        <h1 className="text-lg font-semibold">Bevölkerungsgruppen</h1>
      </header>
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


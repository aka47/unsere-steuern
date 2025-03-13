"use client"

import { PersonalTaxImpact } from "@/components/tax-scenarios/personal-tax-impact"
import { PageHeader } from "@/components/ui/page-header"
import { useSessionPersona } from "@/hooks/useSessionPersona"
import { grokPersonas } from "@/types/persona"
import { PersonaCollection } from "@/components/personas/persona-collection"
import { TaxScenarioNavigation } from "@/components/tax-scenarios/tax-scenario-navigation"
import { TaxScenarioBuilderOrDetails } from "@/components/tax-scenarios/tax-scenario-builder-or-details"

export default function TaxScenariosPage() {
  const { currentPersona } = useSessionPersona()
  const userPersona = currentPersona || null

  const personaCollection = {
    id: "grok",
    title: "Wie übersetzt sich das Steuermodell in Lebensrealitäten?",
    description: "Eine Auswahl repräsentativer Lebensrealitäten",
    personas: grokPersonas
  }

  return (
    <div className="flex flex-col ">

      <PageHeader
        title="Steuerszenarien"
        subtitle="Wählen Sie ein Steuerszenario für die Berechnung"
      >
      </PageHeader>
      <TaxScenarioNavigation />

      <div className="flex-1 space-y-4">
        <div className="p-8 pt-2">
          <TaxScenarioBuilderOrDetails />
          <PersonalTaxImpact userPersona={userPersona} />

          <PersonaCollection collection={personaCollection} />
        </div>

        {/* <div className="p-8 pt-2">
          <PersonaCollection collection={personaCollection} />
        </div> */}

        {/* Szenario-Zusammenfassung */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Auswirkungen auf einen Blick</CardTitle>
            <CardDescription>Die wichtigsten Ergebnisse des gewählten Steuermodells übersichtlich zusammengefasst</CardDescription>
          </CardHeader>
          <CardContent>
            <ScenarioSummary />
          </CardContent>
        </Card> */}

        {/* Persona-Simulationen */}


{/*
        <Card>
          <CardHeader>
            <CardTitle>Lebensrealitäten im Vergleich</CardTitle>
            <CardDescription>
              Erkunden Sie, wie sich das gewählte Steuermodell auf verschiedene Lebenswege auswirkt - von der Berufseinsteigerin
              bis zum Familienvater, von der Facharbeiterin bis zur Selbstständigen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PersonaList personas={grokPersonas} onPersonaClick={() => { }} />
          </CardContent>
        </Card> */}

        {/* <Card>
          <CardHeader>
            <CardTitle>Lebensrealitäten im Vergleich</CardTitle>
            <CardDescription>
              Erkunden Sie, wie sich das gewählte Steuermodell auf verschiedene Lebenswege auswirkt - von der Berufseinsteigerin
              bis zum Familienvater, von der Facharbeiterin bis zur Selbstständigen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PersonaList personas={initialPersonas} onPersonaClick={() => { }} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transparenz & Quellen</CardTitle>
            <CardDescription>
              Alle Berechnungen basieren auf offiziellen Statistiken und wissenschaftlichen Studien. Hier finden Sie detaillierte
              Informationen zu unseren Datenquellen und Methoden.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataSources />
          </CardContent>
        </Card> */}

      </div>
    </div>
  )
}


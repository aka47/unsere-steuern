"use client"

import { PersonalTaxImpact } from "@/components/tax-scenarios/personal-tax-impact"
import { PageHeader } from "@/components/ui/page-header"
import { useSessionPersona } from "@/hooks/useSessionPersona"
// import { grokPersonas } from "@/types/persona"
import { grok2Personas } from "@/data/persona/grok"
// import { grokPersonasCollection } from "@/types/personaCollection"
import { PersonaCollection } from "@/components/personas/persona-collection"
import { TaxScenarioNavigation } from "@/components/tax-scenarios/tax-scenario-navigation"
import { TaxScenarioBuilderOrDetails } from "@/components/tax-scenarios/tax-scenario-builder-or-details"
import { WarningBox } from "@/components/warning-box"
import { CollapsibleBox, DismissibleBox } from "@/components/onboarding"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { useState } from "react"

export default function TaxScenariosPage() {
  const { currentPersona } = useSessionPersona()
  const userPersona = currentPersona || null
  const [usePersonaSize] = useState(true)

  const personaCollection = {
    id: "grok",
    title: "Wie übersetzt sich das Steuermodell in Lebensrealitäten?",
    description: "Eine Auswahl repräsentativer Lebensrealitäten",
    personas: grok2Personas,
    size: 42000000 // Default to 42 million households in Germany
  }

  return (
    <div className="flex flex-col ">

      <PageHeader
        title="Unser Steuersystem heute und Alternativen"
        subtitle="Wählen Sie ein Steuerszenario für die Berechnung"
      >
      </PageHeader>
      <div className="max-w-6xl m-6">
        <DismissibleBox  title="Aktuelle Struktur und Alternativen">
          <p>
            Das Steuersystem in Deutschland basiert auf einem progressiven Modell, bei dem höhere Einkommen stärker besteuert werden. Dies ermöglicht die Finanzierung wichtiger öffentlicher Dienstleistungen wie Bildung, Gesundheitsversorgung und Infrastruktur. Doch es gibt immer wieder Diskussionen über Fairness, Effizienz und die langfristigen Auswirkungen auf unterschiedliche Einkommensgruppen.
          </p>
          <p className="mt-4">
            Diese Seite zeigt nicht nur das aktuelle Steuersystem, sondern auch verschiedene Alternativen. Dazu gehören ein Einheitssteuersatz, eine lebenslange progressive Besteuerung aller Einkommen, historische Steuersysteme in Deutschland und eine individuell anpassbare Variante. Mithilfe interaktiver Grafiken und Modellrechnungen können Sie die Auswirkungen dieser Modelle auf Steuereinnahmen und Einkommensverläufe im Laufe des Lebens nachvollziehen.
          </p>
        </DismissibleBox>
      </div>



      <TaxScenarioNavigation />
      <div className="mx-8 max-w-4xl">

        <WarningBox  header="Steuerrechner ist noch im entstehen!" description="Die hier dargestellten Berechnungen und Zahlen sind noch nicht vollständig, die Zahlen sind noch nicht 100% korrekt und die Berechnungen fehlen noch viele der Ausnahmen und Sonderfälle, welche uns Millarden kosten und keiner wirklich verstehen soll. Das ist bis heute auch sehr gut gelungen." />
      </div>

      <div className="flex-1 space-y-4">
        <div className="p-8 pt-2">
          <TaxScenarioBuilderOrDetails collection={personaCollection} usePersonaSize={usePersonaSize} />
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


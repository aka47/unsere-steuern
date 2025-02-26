"use client"

import { Suspense } from "react"
import { TaxScenarioSelector } from "@/components/tax-scenarios/tax-scenario-selector"
import { PersonaSimulationList } from "@/components/tax-scenarios/persona-simulation-list"
import { ScenarioSummary } from "@/components/tax-scenarios/scenario-summary"
import { DataSources } from "@/components/tax-scenarios/data-sources"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PersonalTaxImpact } from "@/components/tax-scenarios/personal-tax-impact"
import { initialPersonas } from "@/types/persona"
import { TaxScenarioProvider } from "@/hooks/useTaxScenario"
import { PageHeader } from "@/components/ui/page-header"
import { TypographyP } from "@/components/ui/typography"
import { Section, SectionHeader, SectionTitle, SectionDescription, SectionContent } from "@/components/ui/section"
function getRandomPersona() {
  // 50% chance to return a random persona or null
  if (Math.random() < 0.5) {
    const randomIndex = Math.floor(Math.random() * initialPersonas.length)
    return initialPersonas[randomIndex]
  }
  return null
}

export default function TaxScenariosPage() {
  const userPersona = getRandomPersona()

  return (
    <TaxScenarioProvider>
      <div className="flex flex-col gap-6">
        <PageHeader title="Gemeinsam für ein faires Steuersystem" />


        <div className="flex-1 space-y-4 p-8 pt-6">



          <Card>
            <CardHeader>
              <CardTitle>Willkommen bei unserem interaktiven Steuerrechner!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <TypographyP className="max-w-3xl">
                Hier können Sie verschiedene Steuermodelle erkunden und deren Auswirkungen auf unterschiedliche Lebenssituationen verstehen.
                Entdecken Sie, wie sich Änderungen im Steuersystem auf das Lebenseinkommen, den Vermögensaufbau und die
                Steuerlast verschiedener Bevölkerungsgruppen auswirken. Mit diesem Tool möchten wir die Steuerdebatte
                transparenter und zugänglicher machen - denn nur gemeinsam können wir ein gerechtes Steuersystem gestalten.
              </TypographyP>
            </CardContent>
          </Card>

          {/* Steuerszenario-Auswahl */}
          <Section>
            <SectionHeader>
              <SectionTitle>Steuermodell entdecken</SectionTitle>
              <SectionDescription>
                Wählen Sie verschiedene Steuermodelle aus und sehen Sie direkt, wie sich diese auf unterschiedliche Lebensrealitäten auswirken
              </SectionDescription>
            </SectionHeader>
            <SectionContent>
              <TaxScenarioSelector />
            </SectionContent>
          </Section>

          {/* Persönliche Auswirkungen */}
          <PersonalTaxImpact userPersona={userPersona} />

          {/* Szenario-Zusammenfassung */}
          <Card>
            <CardHeader>
              <CardTitle>Auswirkungen auf einen Blick</CardTitle>
              <CardDescription>Die wichtigsten Ergebnisse des gewählten Steuermodells übersichtlich zusammengefasst</CardDescription>
            </CardHeader>
            <CardContent>
              <ScenarioSummary />
            </CardContent>
          </Card>

          {/* Persona-Simulationen */}
          <Card>
            <CardHeader>
              <CardTitle>Lebensrealitäten im Vergleich</CardTitle>
              <CardDescription>
                Erkunden Sie, wie sich das gewählte Steuermodell auf verschiedene Lebenswege auswirkt - von der Berufseinsteigerin
                bis zum Familienvater, von der Facharbeiterin bis zur Selbstständigen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonaSimulationList />
            </CardContent>
          </Card>

          {/* Datenquellen */}
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
          </Card>
        </div>
      </div>
    </TaxScenarioProvider>
  )
}


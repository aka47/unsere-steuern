"use client"

import { TaxScenarioSelector } from "@/components/tax-scenarios/tax-scenario-selector"
import { ScenarioSummary } from "@/components/tax-scenarios/scenario-summary"
import { DataSources } from "@/components/tax-scenarios/data-sources"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PersonalTaxImpact } from "@/components/tax-scenarios/personal-tax-impact"
import { initialPersonas } from "@/types/persona"
import { PageHeader } from "@/components/ui/page-header"
import { useSessionPersona } from "@/hooks/useSessionPersona"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EditIcon, UserIcon } from "lucide-react"
import { PersonaList } from "@/components/personas/persona-list"


export default function TaxScenariosPage() {
  const { persona } = useSessionPersona()
  const userPersona = persona || null

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageHeader title="Steuerszenarien entdecken" subtitle="Wählen Sie verschiedene Steuermodelle aus und sehen Sie direkt, wie sich diese auf unterschiedliche Lebensrealitäten auswirken">
          <Link href="/lebenseinkommen/rechner">
            <Button variant="outline" className="flex items-center gap-2">
              {userPersona ? (
                <>
                  <EditIcon className="h-4 w-4" />
                  Profil bearbeiten
                </>
              ) : (
                <>
                  <UserIcon className="h-4 w-4" />
                  Profil erstellen
                </>
              )}
            </Button>
          </Link>
        </PageHeader>

        <div className="flex-1 space-y-4 p-8 pt-2">
          <TaxScenarioSelector />

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
              <PersonaList personas={initialPersonas} onPersonaClick={() => { }} />
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
    </>
  )
}


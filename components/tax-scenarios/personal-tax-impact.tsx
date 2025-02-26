"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PersonaSimulationCard } from "@/components/tax-scenarios/persona-simulation-card"
import { useTaxScenario } from "@/hooks/useTaxScenario"
import { useRouter } from "next/navigation"
import { Persona } from "@/types/persona"

interface PersonalTaxImpactProps {
  userPersona: Persona | null
}

export function PersonalTaxImpact({ userPersona }: PersonalTaxImpactProps) {
  const router = useRouter()
  const { selectedScenario } = useTaxScenario()

  if (!userPersona) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wie wirkt sich das auf Sie aus?</CardTitle>
          <CardDescription>
            Erstellen Sie Ihr persönliches Profil, um zu sehen, wie die verschiedenen Steuermodelle Sie betreffen würden.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/life-income")}>
            Mein Profil erstellen
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Ihre persönliche Steuerbelastung</h2>
      <PersonaSimulationCard persona={userPersona} scenario={selectedScenario} />
    </div>
  )
}
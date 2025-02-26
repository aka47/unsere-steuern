"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PersonaSimulationCard } from "@/components/tax-scenarios/persona-simulation-card"
import { useRouter } from "next/navigation"
import { Persona } from "@/types/persona"
import { PersonaCard } from "./persona-card"

interface PersonalCreateOrShowProps {
  userPersona: Persona | null
}

export function PersonalCreateOrShow({ userPersona }: PersonalCreateOrShowProps) {
  const router = useRouter()

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
          <Button onClick={() => router.push("/lebenseinkommen/rechner")}>
            Mein Profil erstellen
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl">Ihre Persona</h2>
      <PersonaCard persona={userPersona} onClick={() => {}} />
    </div>
  )
}
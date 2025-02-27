"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PersonaCard } from "@/components/personas/persona-card"
import { useTaxScenario } from "@/hooks/useTaxScenario"
import { Persona } from "@/types/persona"
import Link from "next/link"
import { EditIcon } from "lucide-react"

interface PersonalTaxImpactProps {
  userPersona: Persona | null
}

export function PersonalTaxImpact({ userPersona }: PersonalTaxImpactProps) {
  const { selectedTaxScenario } = useTaxScenario()

  if (!userPersona) {
    return (
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="text-center p-6">
            <h3 className="text-lg font-medium mb-2">Persönliches Profil erstellen</h3>
            <p className="text-muted-foreground mb-4">
              Erstellen Sie ein persönliches Profil, um zu sehen, wie sich die verschiedenen Steuermodelle auf Ihre
              individuelle Situation auswirken würden.
            </p>
            <Link href="/lebenseinkommen/rechner">
              <Button>Profil erstellen</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Ihre persönliche Steuerbelastung</h3>
          <Link href="/lebenseinkommen/rechner">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <EditIcon className="h-4 w-4" />
              Profil bearbeiten
            </Button>
          </Link>
        </div>
        <PersonaCard
          persona={userPersona}
          taxScenario={selectedTaxScenario}
          onClick={() => {}}
        />
      </CardContent>
    </Card>
  )
}
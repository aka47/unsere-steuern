"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PersonaCard } from "@/components/personas/persona-card"
import { useTaxScenario } from "@/hooks/useTaxScenario"
import { Persona } from "@/types/persona"
import Link from "next/link"
import {  SquarePen } from "lucide-react"

interface PersonalTaxImpactProps {
  userPersona: Persona | null
}

export function PersonalTaxImpact({ userPersona }: PersonalTaxImpactProps) {
  const { selectedTaxScenario } = useTaxScenario()

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {userPersona ? "Ihre persönliche Steuerbelastung" : "Persönliches Profil erstellen"}
          </h3>
          <Link href="/lebenseinkommen/rechner">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <SquarePen className="h-4 w-4" />
              {userPersona ? "Bearbeiten" : "Erstellen"}
            </Button>
          </Link>
        </div>
        {userPersona ? (
          <div className="space-y-4">
            <PersonaCard
              persona={userPersona}
              taxScenario={selectedTaxScenario}
              onClick={() => {}}
            />
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="text-muted-foreground">
              Erstellen Sie Ihr persönliches Profil, um zu sehen, wie sich das Steuermodell auf Ihre Situation auswirkt.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
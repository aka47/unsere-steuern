"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type Persona } from "@/types/persona"
import { useRouter } from "next/navigation"
import { useSessionPersona } from "@/hooks/useSessionPersona"
import { PencilIcon, UserIcon, LogOutIcon } from "lucide-react"

interface PersonaCreateOrShowProps {
  userPersona?: Persona | null
}

export function PersonaCreateOrShow({ userPersona }: PersonaCreateOrShowProps) {
  const router = useRouter()
  const { persona: sessionPersona, setPersona, clearPersona } = useSessionPersona()
  const [_isEditing, setIsEditing] = useState(false)

  // Use session persona if available, otherwise use the prop
  const currentPersona = sessionPersona || userPersona

  const handleSaveToSession = () => {
    if (userPersona) {
      setPersona(userPersona)
    }
  }

  const handleEditPersona = () => {
    router.push("/lebenseinkommen/rechner")
    setIsEditing(true)
  }

  if (!currentPersona) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle>Erstellen Sie ihr Lebenseinkommen</CardTitle>
          <CardDescription>
            Sobald Sie ihr Lebenseinkommen erstellt haben, können Sie sehen, wie sich die Steuern auf dieses auswirkt.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Button
            onClick={() => router.push("/lebenseinkommen/rechner")}
            className="w-full"
          >
            Lebenseinkommen erstellen
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Was heisst das für dich?</CardTitle>
            <CardDescription>
              Deine Leben, dein Einkommen, deine Steuern und dein Vermögen.
            </CardDescription>
          </div>
          {sessionPersona ? (
            <div>
              <Button variant="outline" size="icon" onClick={handleEditPersona} title="Persona bearbeiten">
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="ml-2"
                onClick={() => clearPersona()}
              >
                <LogOutIcon className="h-4 w-4 mr-2" />
                Daten entfernen
              </Button>
            </div>

          ) : (
            <Button variant="outline" size="sm" onClick={handleSaveToSession} title="Als aktuelle Persona speichern">
              <UserIcon className="h-4 w-4 mr-2" />
              Als meine Persona speichern
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Dein Alter</p>
            <p>{currentPersona.currentAge} Jahre</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Einkommen heute</p>
            <p>{new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(currentPersona.currentIncome)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Sparrate</p>
            <p>{(currentPersona.savingsRate * 100).toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Erbschaft</p>
            <p>
              {currentPersona.inheritanceAge
                ? `${new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(currentPersona.inheritanceAmount)} mit ${currentPersona.inheritanceAge} Jahren`
                : "Keine"}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        {/* <Button
          onClick={() => router.push("/lebenseinkommen/rechner")}
          className="w-full"
        >
          {sessionPersona ? "Deine Daten bearbeiten" : "Deine Daten eingeben"}
        </Button> */}


      </CardFooter>
    </Card>
  )
}
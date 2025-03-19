"use client"

import React, { useState, useEffect } from "react"
import { LifeIncomeCalculator } from "@/components/life-income/life-income-calculator"
import { type LifeIncomeResults as _LifeIncomeResultsType } from "@/types/life-income"
import { useSessionPersona } from "@/hooks/useSessionPersona"
import { type Persona } from "@/types/persona"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TypographyP } from "@/components/ui/typography"

export default function LifeIncomeCalculatorPage() {
  const { currentPersona: sessionPersona, setCurrentPersona: setSessionPersona } = useSessionPersona()
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(sessionPersona ?? null)
  const [results, setResults] = useState<_LifeIncomeResultsType>(null)

  // Update local state when session persona changes
  useEffect(() => {
    setCurrentPersona(sessionPersona ?? null)
  }, [sessionPersona])

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Lebenseinkommen-Rechner"
        subtitle="Berechnen Sie Ihr persönliches Lebenseinkommen und erfahren Sie, wie sich verschiedene Faktoren auf Ihre finanzielle Zukunft auswirken."
      />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="grid gap-8 lg:grid-cols-1">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle>Ihre Daten</CardTitle>
              <CardDescription>Wir verpflichten uns, diese Informationen nicht an Dritte weiterzugeben und mit äusserter Sicherheit zu behandeln.</CardDescription>
            </CardHeader>
            <CardContent className="">
              <TypographyP className="text-sm w-2/3">
                Ihr Einkommen, Vermögen und andere finanzielle Informationen sind sensible in ihrer Natur.
                Damit Sie verstehen können, wie viel Geld sie mit ihren Steuern für ein gravierend ungleiches Steuersystem zahlen,
                sind diese Information unerlässlich. Und im gleichen Zug zeigen wir Ihnen, wie viel Geld sie sparen können, wenn wir das Steuersystem ändern.
              </TypographyP>

              <TypographyP className="text-sm w-2/3 mt-2">
                Wir freuen uns, wenn Sie eine E-Mail Adresse benutzen für ihren Account auf unsere-steuern.de, die anonymisiert ist und keine Rückschlüsse auf Ihre Person zulässt.
              </TypographyP>
            </CardContent>
          </Card>
          <LifeIncomeCalculator
            setResults={setResults}
            persona={currentPersona}
            setPersona={setCurrentPersona}
          />
        </div>
      </div>
    </div>
  )
}
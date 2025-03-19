"use client"

import React, { useState, useEffect } from "react"
import { LifeIncomeResults } from "@/components/life-income/life-income-results"
import { type LifeIncomeCalculatorResult } from "@/hooks/useLifeIncomeCalculator"
import { PersonaCreateOrShow } from "@/components/personas/persona-create-or-show"
import { PageHeader } from "@/components/ui/page-header"
import { useSessionPersona } from "@/hooks/useSessionPersona"
import { DismissibleBox } from "@/components/onboarding"
import { useLifeIncomeCalculator } from "@/hooks/useLifeIncomeCalculator"

export default function LebenseinkommenPage() {
  const [results, setResults] = useState<LifeIncomeCalculatorResult | null>(null)
  const { currentPersona, setCurrentPersona } = useSessionPersona()
  const { calculateLifeIncome } = useLifeIncomeCalculator()

  // Handle calculations when persona changes
  useEffect(() => {
    if (!currentPersona) return

    const results = calculateLifeIncome({
      ...currentPersona,
      inheritanceAge: currentPersona.inheritanceAge ?? 0,
      currentPersona,
      inheritanceTaxableHousingFinancial: currentPersona.inheritanceHousing,
      inheritanceTaxableCompany: currentPersona.inheritanceCompany,
      inheritanceHardship: false
    })

    if (results) {
      setResults(results)
    }
  }, [currentPersona, calculateLifeIncome])

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Lebenseinkommen"
        subtitle="Berechnen Sie Ihr Lebenseinkommen und die Steuerbelastung"
      />
       <DismissibleBox className="max-w-6xl m-6" title="Wie wirken sich verschiedene Steuern auf mein Netto-Einkommen und Vermögen aus?">
          <p>
            Wie viel Geld verdienen Sie im Laufe Ihres Lebens? Wie viel Steuern müssen Sie dafür zahlen? Und wie viel Geld haben Sie am Ende?
            Diese Fragen können Sie mit diesem Tool beantworten, indem Sie Ihre persönlichen Daten eingeben und wir dies auf ein Arbeitsleben anwenden.
          </p>
        </DismissibleBox>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PersonaCreateOrShow userPersona={currentPersona} />
        <div>
          {/* <LifeIncomeCalculator
            setResults={setResults}
            persona={currentPersona ?? null}
            setPersona={setCurrentPersona}
          /> */}
        </div>
        {results && <LifeIncomeResults results={results} setResults={setResults} currentPersona={currentPersona} />}

      </div>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { useLifeIncomeCalculator } from "@/hooks/useLifeIncomeCalculator"
import { LifeIncomeResults } from "@/components/life-income/life-income-results"
import { PersonaList } from "@/components/personas/persona-list"
import { type Persona, initialPersonas } from "@/types/persona"
import { type LifeIncomeResults as LifeIncomeResultsType } from "@/types/life-income"
import { PersonaCreateOrShow } from "@/components/personas/persona-create-or-show"
import { PageHeader } from "@/components/ui/page-header"

export default function LebenseinkommenPage() {
  const [results, setResults] = useState<LifeIncomeResultsType>(null)
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [personas, setPersonas] = useState(initialPersonas)

  useEffect(() => {
    const storedResults = localStorage.getItem("lifeIncomeResults")
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    }

    const storedPersonas = localStorage.getItem("personas")
    if (storedPersonas) {
      setPersonas(JSON.parse(storedPersonas))
    }
  }, [])

  // const handleSetResults = (
  //   newResults:
  //     | {
  //         age: number
  //         income: number
  //         incomeTax: number
  //         wealth: number
  //         wealthCreatedThisYear: number
  //         inheritance: number
  //         inheritanceTax: number
  //         vat: number
  //         spending: number
  //       }[]
  //     | null,
  // ) => {
  //   setResults(newResults)
  //   if (newResults) {
  //     localStorage.setItem("lifeIncomeResults", JSON.stringify(newResults))
  //   }
  // }
  const { calculateLifeIncome } = useLifeIncomeCalculator()

  const handlePersonaClick = (persona: Persona) => {
    setSelectedPersona(persona)
    // Import the hook inside the component to avoid the React hooks rule violation

    const calculatedResults = calculateLifeIncome({
      ...persona,
      currentAge: persona.initialAge,
      selectedPersona: persona,
    })
    setResults(calculatedResults?.details || null)
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Lebenseinkommen"
        subtitle="Berechnen Sie Ihr Lebenseinkommen und die Steuerbelastung"
      />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PersonaCreateOrShow userPersona={selectedPersona} />
        {/* <PersonaList personas={personas} onPersonaClick={handlePersonaClick} /> */}
        {results && <LifeIncomeResults results={results} setResults={setResults} selectedPersona={selectedPersona} />}
      </div>
    </div>
  )
}


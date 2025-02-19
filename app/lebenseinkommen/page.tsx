"use client"

import { useState, useEffect } from "react"
import { LifeIncomeCalculator } from "@/components/life-income/life-income-calculator"
import { LifeIncomeResults } from "@/components/life-income/life-income-results"
import { PersonaList } from "@/components/life-income/persona-list"
import { type Persona, initialPersonas } from "@/types/persona"

export default function LebenseinkommenPage() {
  const [results, setResults] = useState<
    | {
        age: number
        income: number
        incomeTax: number
        wealth: number
        wealthCreatedThisYear: number
        inheritance: number
        inheritanceTax: number
        vat: number
        spending: number
      }[]
    | null
  >(null)
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

  const handlePersonaClick = (persona: Persona) => {
    setSelectedPersona(persona)
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
        <h1 className="text-lg font-semibold">Lebenseinkommen Berechnung</h1>
      </header>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PersonaList personas={personas} onPersonaClick={handlePersonaClick} />
        <LifeIncomeCalculator
          setResults={setResults}
          selectedPersona={selectedPersona}
          setSelectedPersona={setSelectedPersona}
        />
        {results && <LifeIncomeResults results={results} setResults={setResults} />}
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import { LifeIncomeResults } from "@/components/life-income/life-income-results"
import { type LifeIncomeResults as LifeIncomeResultsType } from "@/types/life-income"
import { PersonaCreateOrShow } from "@/components/personas/persona-create-or-show"
import { PageHeader } from "@/components/ui/page-header"
import { useSessionPersona } from "@/hooks/useSessionPersona"

export default function LebenseinkommenPage() {
  const [results, setResults] = useState<LifeIncomeResultsType>(null)
  const { currentPersona } = useSessionPersona()

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Lebenseinkommen"
        subtitle="Berechnen Sie Ihr Lebenseinkommen und die Steuerbelastung"
      />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PersonaCreateOrShow userPersona={currentPersona} />
        {results && <LifeIncomeResults results={results} setResults={setResults} currentPersona={currentPersona} />}
      </div>
    </div>
  )
}


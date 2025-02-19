"use client"

import { useCallback } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTaxScenario } from "@/hooks/useTaxScenario"

type ScenarioId = "flat" | "progressive-flat" | "no-exceptions" | "loophole-removal"

const scenarios = [
  { id: "flat", name: "Flat Tax" },
  { id: "progressive-flat", name: "Progressive Flat Tax" },
  { id: "no-exceptions", name: "Tax System Without Exceptions" },
  { id: "loophole-removal", name: "Tax Loophole Removal" },
]

export function TaxScenarioSelector() {
  const { selectedScenario, setSelectedScenario } = useTaxScenario()

  const handleScenarioChange = useCallback(
    (value: string) => {
      setSelectedScenario(value as ScenarioId)
    },
    [setSelectedScenario],
  )

  return (
    <Select onValueChange={handleScenarioChange} value={selectedScenario}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a tax scenario" />
      </SelectTrigger>
      <SelectContent>
        {scenarios.map((scenario) => (
          <SelectItem key={scenario.id} value={scenario.id}>
            {scenario.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}


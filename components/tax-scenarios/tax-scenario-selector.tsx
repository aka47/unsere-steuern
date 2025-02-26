"use client"

import { useCallback } from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useTaxScenario } from "@/hooks/useTaxScenario"
import { cn } from "@/lib/utils"

type ScenarioId = "flat" | "progressive-flat" | "no-exceptions" | "loophole-removal" | "50es-tax-levels"

const scenarios = [
  { id: "flat", name: "Einheitssteuer" },
  { id: "progressive-flat", name: "Progressive Einheitssteuer" },
  { id: "50es-tax-levels", name: "Die Steuern unter Kanzler Adenauer" },
  { id: "no-exceptions", name: "Die heutigen Steuern, weniger Ausnahmen" },
  { id: "loophole-removal", name: "Die heutigen Steuern, keine Ausnahmen" },
]

export function TaxScenarioSelector() {
  const { selectedScenario, setSelectedScenario } = useTaxScenario()

  const handleScenarioChange = useCallback(
    (value: ScenarioId) => {
      setSelectedScenario(value)
      console.log("selectedScenario", value)
    },
    [setSelectedScenario],
  )

  return (
    <NavigationMenu className="max-w-full justify-start">
      <NavigationMenuList className="space-x-2">
        {scenarios.map((scenario) => (
          <NavigationMenuItem key={scenario.id}>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "px-4 cursor-pointer",
                selectedScenario === scenario.id && "font-medium bg-accent text-accent-foreground"
              )}
              onClick={() => handleScenarioChange(scenario.id as ScenarioId)}
            >
              {scenario.name}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}


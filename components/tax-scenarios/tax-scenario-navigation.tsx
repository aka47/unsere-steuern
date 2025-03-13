"use client"

import { useCallback } from "react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useTaxScenario } from "@/hooks/useTaxScenario"
import { cn } from "@/lib/utils"

type ScenarioId = "flat" | "progressive-flat" | "no-exceptions" | "loophole-removal" | "50es-tax-levels" | "custom"

const scenarios = [
  { id: "status-quo", name: "Status Quo" },
  { id: "flat", name: "Einheitssteuer" },
  { id: "progressive-flat", name: "Progressive Einheitssteuer" },
  { id: "50es-tax-levels", name: "Die Steuern unter Kanzler Adenauer" },
  { id: "custom", name: "Deine Steuer" },
]

export function TaxScenarioNavigation() {
  const { selectedScenarioId, setSelectedScenarioId } = useTaxScenario()

  const handleScenarioChange = useCallback(
    (value: ScenarioId) => {
      setSelectedScenarioId(value)
      console.log("selectedScenario", value)
    },
    [setSelectedScenarioId],
  )

  return (
    <div className="sticky top-0 z-50 bg-white border-b">
      <NavigationMenu className="max-w-full justify-start px-8">
        <NavigationMenuList className="space-x-2">
          {scenarios.map((scenario) => (
            <NavigationMenuItem key={scenario.id}>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "px-4 cursor-pointer",
                  selectedScenarioId === scenario.id && "font-medium bg-accent text-accent-foreground"
                )}
                onClick={() => handleScenarioChange(scenario.id as ScenarioId)}
              >
                {scenario.name}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
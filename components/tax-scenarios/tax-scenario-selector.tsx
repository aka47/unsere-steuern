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
import { TaxScenarioDetails } from "./tax-scenario-details"
import { TaxScenarioBuilder } from "@/components/tax/tax-scenario-builder"

type ScenarioId = "flat" | "progressive-flat" | "no-exceptions" | "loophole-removal" | "50es-tax-levels" | "custom"

const scenarios = [
  { id: "status-quo", name: "Status Quo" },
  { id: "flat", name: "Einheitssteuer" },
  { id: "progressive-flat", name: "Progressive Einheitssteuer" },
  { id: "50es-tax-levels", name: "Die Steuern unter Kanzler Adenauer" },
  { id: "custom", name: "Deine Steuer" },
  // { id: "no-exceptions", name: "Die heutigen Steuern, weniger Ausnahmen" },
  // { id: "loophole-removal", name: "Die heutigen Steuern, keine Ausnahmen" },
]

export function TaxScenarioSelector() {
  const { selectedScenarioId, setSelectedScenarioId } = useTaxScenario()

  const handleScenarioChange = useCallback(
    (value: ScenarioId) => {
      setSelectedScenarioId(value)
      console.log("selectedScenario", value)
    },
    [setSelectedScenarioId],
  )

  return (
    <div>
      <NavigationMenu className="max-w-full justify-start">
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

      {selectedScenarioId === "custom" ? (
        <TaxScenarioBuilder simulation={{
          params: {
            incomeTaxMultiplier: 1,
            vatRate: 0.19,
            wealthTaxRate: 0.02,
            wealthIncomeTaxRate: 0.25
          },
          result: {
            incomeTax: 0,
            vat: 0,
            wealthTax: 0,
            wealthIncomeTax: 0,
            total: 0
          }
        }} />
      ) : (
        <TaxScenarioDetails
          simulation={{
            incomeTax: 0,
            vat: 0,
            wealthTax: 0,
            wealthIncomeTax: 0,
            total: 0
          }}
        />
      )}
    </div>
  )
}


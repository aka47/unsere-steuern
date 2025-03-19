"use client"

import { SessionProvider } from "next-auth/react"
import React, { ReactNode } from "react"
import { TaxScenarioProvider } from "@/hooks/useTaxScenario"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <TooltipProvider>
        <TaxScenarioProvider>
          {children}
        </TaxScenarioProvider>
      </TooltipProvider>
    </SessionProvider>
  )
}
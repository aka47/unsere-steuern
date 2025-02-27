"use client"

import { SessionProvider } from "next-auth/react"
import React, { ReactNode } from "react"
import { TaxScenarioProvider } from "@/hooks/useTaxScenario"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <TaxScenarioProvider>
        {children}
      </TaxScenarioProvider>
    </SessionProvider>
  )
}
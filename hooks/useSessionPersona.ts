"use client"

import { useSession } from "next-auth/react"
import { useCallback } from "react"
import type { Persona } from "@/types/persona"

export function useSessionPersona() {
  const { data: session, update } = useSession()

  const setPersona = useCallback(async (persona: Persona) => {
    await update({
      currentPersona: {
        ...persona,
        name: "You"
      }
    })
  }, [update])

  const clearPersona = useCallback(async () => {
    await update({
      currentPersona: undefined
    })
  }, [update])

  return {
    persona: session?.currentPersona,
    setPersona,
    clearPersona,
    isLoading: session === undefined
  }
}
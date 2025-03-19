"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useCallback } from "react"
import type { Persona, defaultPersona } from "@/types/persona"

export function useSessionPersona() {
  const { data: session, update } = useSession()
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    const savedPersona = localStorage.getItem("currentPersona")
    if (savedPersona) {
      try {
        const parsedPersona = JSON.parse(savedPersona)
        setCurrentPersona(parsedPersona)
      } catch (error) {
        console.error("Error parsing saved persona:", error)
        localStorage.removeItem("currentPersona")
      }
    }
  }, [])

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

  const updatePersona = (persona: Persona | null) => {
    if (persona === null) {
      localStorage.removeItem("currentPersona")
      setCurrentPersona(null)
    } else {
      localStorage.setItem("currentPersona", JSON.stringify(persona))
      setCurrentPersona(persona)
    }
  }

  return {
    currentPersona: currentPersona || session?.user?.personas?.active || session?.currentPersona,
    setCurrentPersona: updatePersona,
    clearCurrentPersona: clearPersona,
    isLoading: session === undefined
  }
}
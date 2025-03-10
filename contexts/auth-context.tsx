"use client"

import { createContext, useContext, ReactNode } from "react"
import { useSession } from "next-auth/react"
import type { Session } from "next-auth"

interface AuthContextType {
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  isAuthenticated: false
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()

  const value = {
    session,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated"
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
import { DefaultSession } from "next-auth"
import type { Persona } from "./persona"

declare module "next-auth" {
  interface Session {
    currentPersona?: Persona
    user?: {
      id?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    currentPersona?: Persona
  }
}
import { Persona } from "@/types/persona";
import "next-auth";
import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id */
      id: string;
      /** The user's name */
      name?: string | null;
      /** The user's email address */
      email?: string | null;
      /** The user's image */
      image?: string | null;
      /** The user's personas */
      personas?: {
        active?: Persona;
        all?: Persona[];
      };
    };
    currentPersona?: Persona;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    personaId?: string | null;
    personas?: {
      active?: Persona;
      all?: Persona[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    personaId?: string;
    personas?: {
      active?: Persona;
      all?: Persona[];
    };
  }
}
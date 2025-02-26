import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"
import type { Persona } from "@/types/persona"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is a simplified demo auth - in production, you'd validate against a real database
        if (credentials?.username === "demo" && credentials?.password === "demo") {
          return {
            id: "1",
            name: "Demo User",
            email: "demo@example.com",
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      // Send properties to the client
      if (token.currentPersona) {
        session.currentPersona = token.currentPersona as Persona
      }
      return session
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
      }

      // Update session
      if (trigger === "update" && session?.currentPersona) {
        token.currentPersona = session.currentPersona
      }

      return token
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
import NextAuth from "next-auth";

// Move authOptions to a separate file
import { authOptions } from "@/lib/auth";

// Export the NextAuth handler
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
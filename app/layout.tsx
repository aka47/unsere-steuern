import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { Providers } from "./providers"
import { SessionInitializer } from "@/components/session-initializer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Steuern verstehen - Gemeinsam gestalten",
  description: "Entdecken Sie, wie verschiedene Steuermodelle sich auf unsere Gesellschaft auswirken",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <SessionInitializer />
          <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="flex flex-col">
              <main className="flex flex-col">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}


import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { Providers } from "./providers"

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
    <html lang="de">
      <body className={inter.className}>
        <Providers>
          <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <main className="flex flex-col">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}


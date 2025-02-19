"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, LayoutDashboard, PieChart, Users, TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Dashboard",
    href: "/home",
    icon: LayoutDashboard,
  },
  {
    name: "Steuern",
    href: "/steuern",
    icon: PieChart,
  },
  {
    name: "Einkommen",
    href: "/income",
    icon: BarChart3,
  },
  {
    name: "Vermögen",
    href: "/wealth",
    icon: BarChart3,
  },
  {
    name: "Lebenseinkommen",
    href: "/lebenseinkommen",
    icon: TrendingUp,
  },
  {
    name: "Bevölkerungsgruppen",
    href: "/demographics",
    icon: Users,
  },
  {
    name: "Steuerszenarien",
    href: "/tax-scenarios",
    icon: BarChart3,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r border-zinc-200 bg-white lg:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b border-zinc-200 px-6">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <Home className="h-6 w-6" />
            <span className="text-zinc-900">Wir Steuern</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900",
                  pathname === item.href && "bg-zinc-100 text-zinc-900",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="fixed bottom-0 left-0 w-[280px] bg-white border-t border-zinc-200 p-4">
            <div className="flex flex-row gap-4 justify-center text-xs">
              <Link
                href="/impressum"
                className="text-zinc-500 hover:text-zinc-900"
              >
                Impressum
              </Link>
              <Link
                href="/wir"
                className="text-zinc-500 hover:text-zinc-900"
              >
                Über uns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, LayoutDashboard, PieChart, Users, TrendingUp, LogIn, LogOut, User, UserCircle } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { taxScenarios } from "@/constants/tax-scenarios"
import { useTaxScenario } from "@/hooks/useTaxScenario"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSessionPersona } from "@/hooks/useSessionPersona"
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
    href: "/einkommen",
    icon: BarChart3,
  },
  {
    name: "Vermögen",
    href: "/vermoegen",
    icon: BarChart3,
  },
  {
    name: "Lebenseinkommen",
    href: "/lebenseinkommen",
    icon: TrendingUp,
  },
  {
    name: "Bevölkerungsgruppen",
    href: "/bevoelkerungsgruppen",
    icon: Users,
  },
  {
    name: "Steuerszenarien",
    href: "/steuerszenarien",
    icon: BarChart3,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: _session, status } = useSession()
  const { persona } = useSessionPersona()
  const { selectedScenarioId, setSelectedScenarioId } = useTaxScenario()
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

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

        {/* User section */}
        <div className="mt-auto fixed bottom-0 left-0 w-[280px] bg-white border-t border-zinc-200 p-4">
          <div className="">
            {status === "authenticated" ? (
              <div className="space-y-4">
                {persona && (
                  <div className="flex items-center gap-2 px-2">
                    <User className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm font-medium truncate">{persona.name}</span>
                  </div>
                )}
                <div className="flex flex-col gap-2 px-2">
                  <Label htmlFor="scenario-select" className="text-xs text-zinc-500">
                    Steuermodell
                  </Label>
                  <Select
                    value={selectedScenarioId}
                    onValueChange={(value) => setSelectedScenarioId(value as "flat" | "progressive-flat" | "50es-tax-levels" | "no-exceptions" | "loophole-removal")}
                  >
                    <SelectTrigger id="scenario-select" className="w-full">
                      <SelectValue placeholder="Wähle ein Steuermodell">
                        {taxScenarios.find(s => s.id === selectedScenarioId)?.name || "Status Quo"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {taxScenarios.map((scenario) => (
                        <SelectItem key={scenario.id} value={scenario.id}>
                          {scenario.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Link href="/profile">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start mb-2"
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profil
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Abmelden
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <LogIn className="mr-2 h-4 w-4" />
                  Anmelden
                </Button>
              </Link>
            )}
          </div>
          <div className=" p-4">
            <div className="flex flex-row gap-4 justify-center text-xs">
              <Link
                href="/impressum"
                className="text-zinc-500 hover:text-zinc-900"
              >
                Impressum
              </Link>
              <Link
                href="/datenschutz"
                className="text-zinc-500 hover:text-zinc-900"
              >
                Datenschutz
              </Link>
              {/* <Link
                href="/wir"
                className="text-zinc-500 hover:text-zinc-900"
              >
                Über uns
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


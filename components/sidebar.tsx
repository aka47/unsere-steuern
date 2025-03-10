"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { BarChart3, LayoutDashboard, PieChart, Users, TrendingUp, LogIn, LogOut, User, UserCircle } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useSessionPersona } from "@/hooks/useSessionPersona"
import { cn } from "@/lib/utils"

const mainNav = [
  {
    name: "Dashboard",
    href: "/home",
    icon: LayoutDashboard,
  },
]

const backgroundNav = [
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

]

const ourTaxNav = [
  {
    name: "Steuerszenarien",
    href: "/steuerszenarien",
    icon: BarChart3,
  },
  {
    name: "Bevölkerungsgruppen",
    href: "/bevoelkerungsgruppen",
    icon: Users,
  },
  {
    name: "Lebenseinkommen",
    href: "/lebenseinkommen",
    icon: TrendingUp,
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const { status } = useSession()
  const { currentPersona } = useSessionPersona()
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <div className="hidden border-r border-zinc-200 bg-white lg:block" id="sidebar">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[80px] items-center border-b border-zinc-200 px-6">
          <Link className="flex items-center gap-2 font-semibold w-full" href="/">
            <Image
              src="/assets/logo.svg"
              alt="Unsere Steuern Logo"
              width={60}
              height={40}
              className="text-zinc-900"
            />
            <span className="text-lg uppercase font-semibold">unsere Steuern</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {/* Main Navigation */}
            <div className="mb-4">
              {mainNav.map((item) => (
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
            </div>
            {/* Our Taxes Navigation */}
            <div className="mb-4">
              <h2 className="px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase">Unsere Steuern</h2>
              {ourTaxNav.map((item) => (
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
            </div>

            {/* Background Navigation */}
            <div className="mb-4">
              <h2 className="px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase">Hintergrund</h2>
              {backgroundNav.map((item) => (
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
            </div>
          </nav>
        </div>

        {/* User section */}
        <div className="mt-auto fixed bottom-0 left-0 w-[280px] bg-white border-t border-zinc-200 p-4">
          <div className="">
            {status === "authenticated" ? (
              <div className="space-y-4">
                {currentPersona && (
                  <div className="flex items-center gap-2 px-2">
                    <User className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm font-medium truncate">{currentPersona.name}</span>
                  </div>
                )}
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
          <div className="p-4">
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

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


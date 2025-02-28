"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PersonaSelector } from "@/components/persona-selector";
import { useSession } from "next-auth/react";

export function SiteHeader() {
  const pathname = usePathname();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Don't show the header on the auth page
  if (pathname === "/auth") {
    return null;
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 lg:h-[60px] items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="hover:bg-zinc-100">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="hover:bg-zinc-100">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              type="search"
              placeholder="Suchen..."
              className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 border-zinc-200 focus:border-zinc-400 focus:ring-zinc-400"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <PersonaSelector />

            <div className="flex items-center gap-2">
              <Link href="/profile">
                <Button variant="outline" size="icon" className="hover:bg-zinc-100">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <Link href="/auth">
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
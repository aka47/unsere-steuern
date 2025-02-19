"use client"

import Personas from "@/components/life-income/personas"

export default function DemographicsPage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
        <h1 className="text-lg font-semibold">Bevölkerungsgruppen</h1>
      </header>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Personas />
      </div>
    </div>
  )
}


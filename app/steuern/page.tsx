"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IncomeTaxTab } from "@/components/tax-tabs/income-tax-tab"
import IncomeVsInheritance from "@/components/tax-tabs/income-vs-inheritance"
import { InheritanceTaxTab } from "@/components/tax-tabs/inheritance-tax-tab"

export default function SteuernPage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
        <h1 className="text-lg font-semibold">Steuern in Deutschland</h1>
      </header>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Tabs defaultValue="income" className="space-y-4">
          <TabsList>
            <TabsTrigger value="income">Einkommenssteuern</TabsTrigger>
            <TabsTrigger value="inheritance">Erbschaftssteuer</TabsTrigger>
            <TabsTrigger value="comparison">Einkommen vs Erbschaftssteuer</TabsTrigger>
          </TabsList>
          <TabsContent value="income">
            <IncomeTaxTab />
          </TabsContent>
          <TabsContent value="inheritance">
            <InheritanceTaxTab />
          </TabsContent>
          <TabsContent value="comparison">
            <IncomeVsInheritance />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


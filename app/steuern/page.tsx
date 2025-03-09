"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IncomeTaxTab } from "@/components/tax-tabs/income-tax-tab"
import IncomeVsInheritance from "@/components/tax-tabs/income-vs-inheritance"
import { InheritanceTaxTab } from "@/components/tax-tabs/inheritance-tax-tab"
import { PageHeader } from "@/components/ui/page-header"
import { TaxRevenueChart } from "@/components/tax/tax-revenue-chart"
import { TaxSimulationResults } from "@/components/tax/tax-simulation-results"
import { baseline, target, finalResult } from "@/constants/simulation"
import { TaxDistribution } from "@/types/life-income"

export default function SteuernPage() {
  const defaultTaxDistribution: TaxDistribution = {
    incomeTax: 0,
    vat: 0,
    wealthTax: 0,
    wealthIncomeTax: 0,
    total: 0
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Steuern in Deutschland"
        subtitle="In diesem Dashboard können Sie die aktuelle Steuerverteilung in Deutschland sehen."
      />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TaxRevenueChart data={defaultTaxDistribution} />
        <TaxSimulationResults
          baseline={baseline}
          target={target}
          result={finalResult}
        />

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


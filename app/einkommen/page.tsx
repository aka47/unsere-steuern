import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/ui/page-header"
import { IncomeOverview } from "@/components/income/income-overview"
import { IncomeDistribution } from "@/components/income/income-distribution"
import { TaxBrackets } from "@/components/income/tax-brackets"
import { AdditionalInsights } from "@/components/income/additional-insights"
import { DataSources } from "@/components/income/data-sources"

export default function IncomeDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Einkommen in Deutschland"
        subtitle="In diesem Dashboard können Sie die aktuelle Einkommensverteilung in Deutschland sehen."
      />


      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense fallback={<IncomeOverviewSkeleton />}>
          <IncomeOverview />
        </Suspense>

        {/* Main Grid Layout */}
        <div className="grid gap-6 md:grid-cols-2">
          <IncomeDistribution />

          {/* Tax Brackets */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Lohnsteuer-Tarife und Rechner</CardTitle>
              <CardDescription>Progressive Besteuerung des Arbeitseinkommens</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <TaxBrackets />
              </Suspense>
            </CardContent>
          </Card>

          {/* Additional Insights */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Zusätzliche Erkenntnisse</CardTitle>
              <CardDescription>Vergleiche und Trends im Kontext</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                <AdditionalInsights />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Data Sources */}
        <DataSources />
      </div>
    </div>
  )
}

function IncomeOverviewSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="space-y-0 pb-2">
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-1/3" />
            <Skeleton className="mt-1 h-4 w-4/5" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


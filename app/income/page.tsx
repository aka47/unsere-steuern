import { Suspense } from "react"
import { Info } from "lucide-react"

import { IncomeOverview } from "@/components/income/income-overview"
import { IncomeDistribution } from "@/components/income/income-distribution"
import { TaxBrackets } from "@/components/income/tax-brackets"
import { AdditionalInsights } from "@/components/income/additional-insights"
import { DataSources } from "@/components/income/data-sources"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PageHeader } from "@/components/ui/page-header"
export default function IncomeDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Einkommen aus Löhnen in Deutschland"
        subtitle="Das Einkommen aus Löhnen (Arbeitseinkommen) ist die Haupteinnahmequelle für die meisten Menschen und ein wichtiger Faktor für die Wirtschaft und öffentlichen Finanzen. Diese Übersicht zeigt die Verteilung und steuerliche Auswirkung von Lohneinkommen in Deutschland."
      />


      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense fallback={<IncomeOverviewSkeleton />}>
          <IncomeOverview />
        </Suspense>

        {/* Main Grid Layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Income Distribution */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Einkommensverteilung</CardTitle>
                  <CardDescription>Monatliches Bruttoäquivalenzeinkommen nach Perzentilen</CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Bruttoäquivalenzeinkommen berücksichtigt die Haushaltsgröße und -zusammensetzung
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <IncomeDistribution />
              </Suspense>
            </CardContent>
          </Card>

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


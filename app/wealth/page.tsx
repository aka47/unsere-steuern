import { Suspense } from "react"
import { Info } from "lucide-react"

import { WealthOverview } from "@/components/wealth/wealth-overview"
import { WealthDistribution } from "@/components/wealth/wealth-distribution"
import { InequalityMetrics } from "@/components/wealth/inequality-metrics"
import { WealthTypeBreakdown } from "@/components/wealth/wealth-type-breakdown"
import { DataSources } from "@/components/wealth/data-sources"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PageHeader } from "@/components/ui/page-header"

export default function WealthDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vermögen in Deutschland"
        subtitle="Das Vermögen (akkumulierte Vermögenswerte wie Ersparnisse, Immobilien, Aktien und Investitionen abzüglich Verbindlichkeiten) und seine Verteilung sind zentrale Indikatoren für wirtschaftliche Chancengleichheit und gesellschaftlichen Zusammenhalt."
      />

      {/* Total Wealth Overview */}


      {/* Main Grid Layout */}
      <div className="flex-1 space-y-4 p-8 pt-6">

        <Suspense fallback={<WealthOverviewSkeleton />}>
          <WealthOverview />
        </Suspense>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Wealth Distribution */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Vermögensverteilung</CardTitle>
                  <CardDescription>Verteilung des Gesamtvermögens nach Bevölkerungsgruppen</CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Basierend auf Haushaltsdaten des DIW Berlin</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                <WealthDistribution />
              </Suspense>
            </CardContent>
          </Card>

          {/* Inequality Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Ungleichheitsmetriken</CardTitle>
              <CardDescription>Gini-Koeffizient und Lorenz-Kurve</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                <InequalityMetrics />
              </Suspense>
            </CardContent>
          </Card>

          {/* Wealth Type Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Vermögensarten</CardTitle>
              <CardDescription>Verteilung nach Vermögenstypen</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                <WealthTypeBreakdown />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data Sources */}
      <DataSources />
    </div>
  )
}

function WealthOverviewSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
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


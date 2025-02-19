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

export default function WealthDashboard() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Vermögen in Deutschland</h1>
          <p className="text-muted-foreground max-w-3xl">
            Das Vermögen (akkumulierte Vermögenswerte wie Ersparnisse, Immobilien, Aktien und Investitionen abzüglich
            Verbindlichkeiten) und seine Verteilung sind zentrale Indikatoren für wirtschaftliche Chancengleichheit und
            gesellschaftlichen Zusammenhalt.
          </p>
        </div>

        {/* Total Wealth Overview */}
        <Suspense fallback={<WealthOverviewSkeleton />}>
          <WealthOverview />
        </Suspense>

        {/* Main Grid Layout */}
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

        {/* Data Sources */}
        <DataSources />
      </div>
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


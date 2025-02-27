"use client"

import { useState } from "react"
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { incomeDistributionByGroups, incomeDistributionByPercentile, totalIncome } from "@/data/income"

export function IncomeDistribution() {
  const [activeTab, setActiveTab] = useState("percentiles")

  // Format currency for tooltips (convert trillion to billion)
  const formatCurrency = (value: number) => {
    // Convert trillion to billion (multiply by 1000)
    const valueInBillions = value * 1000;
    return `${valueInBillions.toFixed(1)} Mrd. €`
  }

  // Format percentage for tooltips
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Einkommensverteilung in Deutschland</CardTitle>
        <CardDescription>
          Jährliches Einkommen nach Perzentilen und Einkommensgruppen (Gesamteinkommen: {formatCurrency(totalIncome)})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="percentiles">Nach Perzentilen</TabsTrigger>
            <TabsTrigger value="groups">Nach Gruppen</TabsTrigger>
          </TabsList>

          <TabsContent value="percentiles" className="mt-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeDistributionByPercentile}>
                  <XAxis dataKey="label" />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    // Convert trillion to billion for display
                    tickFormatter={(value) => `${(value * 1000).toFixed(0)}`}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "wages") return [formatCurrency(value), "Lohneinkommen"];
                      if (name === "wealthIncome") return [formatCurrency(value), "Vermögenseinkommen"];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Perzentil: ${label}`}
                  />
                  <Legend
                    formatter={(value) => {
                      if (value === "wages") return "Lohneinkommen";
                      if (value === "wealthIncome") return "Vermögenseinkommen";
                      return value;
                    }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="wages"
                    stackId="a"
                    fill="hsl(var(--primary))"
                    name="wages"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="wealthIncome"
                    stackId="a"
                    fill="hsl(var(--secondary))"
                    name="wealthIncome"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Die Grafik zeigt die Verteilung des jährlichen Einkommens nach Perzentilen in Milliarden Euro, aufgeteilt in Lohneinkommen und Vermögenseinkommen.</p>
              <p>Beachten Sie den deutlichen Anstieg des Vermögenseinkommens in den oberen Perzentilen.</p>
            </div>
          </TabsContent>

          <TabsContent value="groups" className="mt-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeDistributionByGroups}>
                  <XAxis dataKey="group" />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    // Convert trillion to billion for display
                    tickFormatter={(value) => `${(value * 1000).toFixed(0)}`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#8884d8"
                    tickFormatter={(value) => `${value.toFixed(0)}%`}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "percentage") return [formatPercentage(value), "Anteil am Gesamteinkommen"];
                      if (name === "wages") return [formatCurrency(value), "Lohneinkommen"];
                      if (name === "wealthIncome") return [formatCurrency(value), "Vermögenseinkommen"];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Gruppe: ${label}`}
                  />
                  <Legend
                    formatter={(value) => {
                      if (value === "wages") return "Lohneinkommen";
                      if (value === "wealthIncome") return "Vermögenseinkommen";
                      if (value === "percentage") return "Anteil am Gesamteinkommen";
                      return value;
                    }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="wages"
                    stackId="a"
                    fill="hsl(var(--primary))"
                    name="wages"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="wealthIncome"
                    stackId="a"
                    fill="hsl(var(--secondary))"
                    name="wealthIncome"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="percentage"
                    fill="#8884d8"
                    name="percentage"
                    opacity={0.5}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Die Grafik zeigt die Verteilung des jährlichen Einkommens nach Bevölkerungsgruppen in Milliarden Euro.</p>
              <p>Die oberen 10% erhalten etwa {formatPercentage(incomeDistributionByGroups[2].percentage)} des Gesamteinkommens,
                 während die unteren 50% nur {formatPercentage(incomeDistributionByGroups[0].percentage)} erhalten.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


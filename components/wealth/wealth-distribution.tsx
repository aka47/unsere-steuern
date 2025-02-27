"use client"

import { useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { wealthDistributionByDecile, wealthDistributionByGroups, wealthPerPersonByDecile } from "@/data/wealth"

export function WealthDistribution() {
  const [activeTab, setActiveTab] = useState("groups")

  // Format currency values for tooltips
  const formatCurrency = (value: number, isTrillion = false) => {
    if (isTrillion) {
      return `${value.toFixed(2)} Bio. €`
    }
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="groups">Vermögensgruppen</TabsTrigger>
            <TabsTrigger value="deciles">Vermögensdezile</TabsTrigger>
            <TabsTrigger value="perPerson">Pro Person</TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="mt-4">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wealthDistributionByGroups}>
                  <XAxis dataKey="group" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(1)}%`, "Anteil am Gesamtvermögen"]}
                    labelFormatter={(label) => `Gruppe: ${label}`}
                  />
                  <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="deciles" className="mt-4">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wealthDistributionByDecile}>
                  <XAxis dataKey="label" />
                  <YAxis tickFormatter={(value) => formatCurrency(value, true)} />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value, true), "Vermögen in Bio. €"]}
                    labelFormatter={(label) => `Dezil: ${label}`}
                  />
                  <Bar dataKey="wealth" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="perPerson" className="mt-4">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wealthPerPersonByDecile}>
                  <XAxis dataKey="label" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Vermögen pro Person"]}
                    labelFormatter={(label) => `Dezil: ${label}`}
                  />
                  <Bar dataKey="wealth" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


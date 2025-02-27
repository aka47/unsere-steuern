"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { totalWealth, wealthBreakdownByCategory, wealthDistributionByGroups } from "@/data/wealth"


// Calculate metrics based on the data
const metrics = [
  {
    title: "Gesamtvermögen",
    value: `${totalWealth.toFixed(1)} Bio. €`,
    description: "Privates Nettovermögen",
  },
  {
    title: "Durchschnittsvermögen",
    value: "159.300 €",
    description: "Pro Haushalt",
  },
  {
    title: "Median-Vermögen",
    value: "70.800 €",
    description: "Pro Haushalt",
  },
  {
    title: "Vermögenskonzentration",
    value: `${wealthDistributionByGroups[2].percentage.toFixed(1)}%`,
    description: "Anteil der oberen 10%",
  },
]

// Colors for the pie chart
const COLORS = [
  'hsl(var(--primary))',
  'hsl(217, 91%, 60%)',
  'hsl(262, 80%, 60%)',
  'hsl(316, 70%, 50%)',
  'hsl(358, 75%, 59%)',
  'hsl(32, 94%, 60%)',
];

export function WealthOverview() {
  // Format currency for tooltips
  const formatCurrency = (value: number) => {
    return `${value.toFixed(2)} Bio. €`
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vermögensverteilung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {wealthDistributionByGroups.map((group) => (
                <div key={group.group} className="flex flex-col space-y-2">
                  <div className="text-lg font-medium">{group.group}</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold">{group.percentage.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">({group.amount})</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${group.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vermögenszusammensetzung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wealthBreakdownByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="category"
                    label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                  >
                    {wealthBreakdownByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Vermögen"]}
                    labelFormatter={(name) => `Kategorie: ${name}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { taxRevenueBreakdown, TOTAL_TAX_REVENUE } from "@/data/tax"

// Colors for the pie chart
const COLORS = [
  'hsl(var(--primary))',
  'hsl(217, 91%, 60%)',
  'hsl(262, 80%, 60%)',
  'hsl(316, 70%, 50%)',
  'hsl(358, 75%, 59%)',
  'hsl(32, 94%, 60%)',
  'hsl(142, 71%, 45%)',
];

export function TaxRevenueChart() {
  const [activeTab, setActiveTab] = useState<"chart" | "table">("chart")

  // Format currency for tooltips
  const formatCurrency = (value: number): string => {
    return `${value.toFixed(1)} Mrd. €`
  }

  // Format percentage for tooltips
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Steuereinnahmen in Deutschland</CardTitle>
        <CardDescription>
          Verteilung der Steuereinnahmen nach Kategorien (Gesamt: {formatCurrency(TOTAL_TAX_REVENUE)})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as "chart" | "table")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart">Diagramm</TabsTrigger>
            <TabsTrigger value="table">Tabelle</TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="mt-4">
            <div className="h-[400px] flex flex-col">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taxRevenueBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="category"
                    label={({ category, percentage }) => percentage > 3 ? `${category}: ${percentage}%` : ''}
                  >
                    {COLORS.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Steuereinnahmen"]}
                    labelFormatter={(name) => `Kategorie: ${name}`}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    formatter={(value, entry) => {
                      // Find the corresponding data entry
                      const dataEntry = taxRevenueBreakdown.find(item => item.category === value);
                      return dataEntry ? `${value} (${formatPercentage(dataEntry.percentage)})` : value;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Die Grafik zeigt die Verteilung der Steuereinnahmen des Bundes und der Länder vor der Umverteilung an Gemeinden und die EU.</p>
                <p>Die Einkommensteuer macht mit {formatPercentage(taxRevenueBreakdown[0].percentage)} den größten Anteil aus, gefolgt von der Mehrwertsteuer mit {formatPercentage(taxRevenueBreakdown[1].percentage)}.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="table" className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Steuerkategorie</TableHead>
                  <TableHead className="text-right">Betrag (Mrd. €)</TableHead>
                  <TableHead className="text-right">Anteil (%)</TableHead>
                  <TableHead>Beschreibung</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxRevenueBreakdown.map((tax) => (
                  <TableRow key={tax.category}>
                    <TableCell className="font-medium">{tax.category}</TableCell>
                    <TableCell className="text-right">{tax.amount.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{tax.percentage.toFixed(2)}%</TableCell>
                    <TableCell>{tax.description}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell>Gesamt</TableCell>
                  <TableCell className="text-right">{TOTAL_TAX_REVENUE.toFixed(1)}</TableCell>
                  <TableCell className="text-right">100.00%</TableCell>
                  <TableCell>Steuereinnahmen vor Umverteilung</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
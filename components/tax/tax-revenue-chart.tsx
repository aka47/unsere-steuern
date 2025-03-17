"use client"

import { useState } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaxDistribution } from "@/types/life-income"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal } from "lucide-react"

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

interface TaxRevenueChartProps {
  data: TaxDistribution
}

export function TaxRevenueChart({ data }: TaxRevenueChartProps) {
  const [activeTab, setActiveTab] = useState<"chart" | "table">("chart")

  // Format currency for tooltips
  const formatCurrency = (value: number): string => {
    return `${value.toFixed(1)} €`
  }

  // Format percentage for tooltips
  const formatPercentage = (value: number, total: number): string => {
    return `${((value / total) * 100).toFixed(1)}%`
  }

  // Transform data for the chart
  const chartData = [
    {
      category: "Einkommensteuer",
      amount: data.incomeTax,
      percentage: (data.incomeTax / data.total) * 100,
      description: "Lohn-, Gehalts- und veranlagte Einkommensteuer"
    },
    {
      category: "Mehrwertsteuer",
      amount: data.vat,
      percentage: (data.vat / data.total) * 100,
      description: "Verbrauchsteuer auf Waren und Dienstleistungen"
    },
    {
      category: "Vermögenssteuer",
      amount: data.wealthTax,
      percentage: (data.wealthTax / data.total) * 100,
      description: "Steuer auf Vermögen"
    },
    {
      category: "Kapitalertragssteuer",
      amount: data.wealthIncomeTax,
      percentage: (data.wealthIncomeTax / data.total) * 100,
      description: "Steuer auf Kapitalerträge"
    },
    // {
    //   category: "Erbschaftsteuer",
    //   amount: data.inheritanceTax,
    //   percentage: (data.inheritanceTax / data.total) * 100,
    //   description: "Steuer auf vererbte Vermögen"
    // }
  ]

  return (
    <>
      <Alert className="mt-4" variant="default">
        <Terminal className="h-4 w-4" />

        <AlertTitle>
          Was empfinden sie als gerechte und gute Steuerlastverteilung?
        </AlertTitle>
        <AlertDescription>
          In einer Demokratie sind wir alle gefragt, ein jeder und eine jede für unsere Land, unsere Gemeinschaft und Mitmenschen sich einzubringen.
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle>Steuereinnahmen</CardTitle>
          <CardDescription>
            Verteilung der Steuereinnahmen nach Kategorien (Gesamt: {formatCurrency(data.total)})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as "chart" | "table")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chart">Diagramm</TabsTrigger>
              <TabsTrigger value="table">Tabelle</TabsTrigger>
            </TabsList>

            <TabsContent value="chart" className="mt-4">
              <div className="h-[450px] flex flex-col">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="category"
                      label={({ category, percentage }) => percentage > 3 ? `${category}: ${percentage.toFixed(1)}%` : ''}
                    >
                      {COLORS.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, _entry) => [formatCurrency(value), "Steuereinnahmen"]}
                      labelFormatter={(name) => `Kategorie: ${name}`}
                    />
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      formatter={(value, _entry) => {
                        // Find the corresponding data entry
                        const dataEntry = chartData.find(item => item.category === value);
                        return dataEntry ? `${value} (${(dataEntry.amount / data.total * 100).toFixed(1)}%)` : value;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Die Grafik zeigt die Verteilung der Steuereinnahmen nach Kategorien.</p>
                  <p>Die Einkommensteuer macht mit {formatPercentage(data.incomeTax, data.total)} den größten Anteil aus, gefolgt von der Mehrwertsteuer mit {formatPercentage(data.vat, data.total)}.</p>
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
                  {chartData.map((tax) => (
                    <TableRow key={tax.category}>
                      <TableCell className="font-medium">{tax.category}</TableCell>
                      <TableCell className="text-right">{formatCurrency(tax.amount)}</TableCell>
                      <TableCell className="text-right">{tax.percentage.toFixed(2)}%</TableCell>
                      <TableCell>{tax.description}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell>Gesamt</TableCell>
                    <TableCell className="text-right">{formatCurrency(data.total)}</TableCell>
                    <TableCell className="text-right">100.00%</TableCell>
                    <TableCell>Gesamte Steuereinnahmen</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  )
}
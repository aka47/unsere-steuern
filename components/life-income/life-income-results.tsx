"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { type LifeIncomeYearlyResult, type LifeIncomeResults } from "@/types/life-income"
import { type Persona } from "@/types/persona"
import { TypographyH3, TypographyP, TypographySmall, TypographyLarge, TypographyMuted } from "@/components/ui/typography"

interface LifeIncomeResultsProps {
  results: LifeIncomeYearlyResult[]
  setResults: React.Dispatch<React.SetStateAction<LifeIncomeResults>>
  selectedPersona?: Persona | null
}

export function LifeIncomeResults({ results: initialResults, setResults, selectedPersona }: LifeIncomeResultsProps) {
  const [localResults, setLocalResults] = useState(initialResults)
  const [showDetailedTable, setShowDetailedTable] = useState(false)

  useEffect(() => {
    setLocalResults(initialResults)
  }, [initialResults])

  const totalIncome = localResults.reduce((sum, result) => sum + result.income, 0)
  const totalIncomeTax = localResults.reduce((sum, result) => sum + result.incomeTax, 0)
  const totalInheritanceTax = localResults.reduce((sum, result) => sum + result.inheritanceTax, 0)
  const totalVAT = localResults.reduce((sum, result) => sum + result.vat, 0)
  const totalSpending = localResults.reduce((sum, result) => sum + result.spending, 0)
  const finalWealth = localResults[localResults.length - 1].wealth
  const totalTaxes = totalIncomeTax + totalInheritanceTax + totalVAT

  const handleValueChange = (
    age: number,
    field:
      | "income"
      | "incomeTax"
      | "wealth"
      | "wealthCreatedThisYear"
      | "inheritance"
      | "inheritanceTax"
      | "vat"
      | "spending",
    newValue: string,
  ) => {
    const updatedResults = localResults.map((result) =>
      result.age === age ? { ...result, [field]: Number.parseInt(newValue) || 0 } : result,
    )
    setLocalResults(updatedResults)
    setResults(updatedResults)
    localStorage.setItem("lifeIncomeResults", JSON.stringify(updatedResults))
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)

  const createChartData = (results: LifeIncomeYearlyResult[]) => {
    let totalIncomeSoFar = 0
    let totalTaxSoFar = 0

    return results.map((result) => {
      totalIncomeSoFar += result.income
      totalTaxSoFar += result.incomeTax + result.inheritanceTax

      return {
        age: result.age,
        wealth: result.wealth,
        income: result.income,
        incomeTax: result.incomeTax,
        totalIncome: totalIncomeSoFar,
        yearlyTotalTax: result.incomeTax + result.inheritanceTax,
        totalTax: totalTaxSoFar
      }
    })
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-md border-primary/20">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle>Zusammenfassung</CardTitle>
          <CardDescription>
            {selectedPersona ? `Übersicht für ${selectedPersona.name}` : "Übersicht Ihrer finanziellen Lebensbilanz"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {selectedPersona && (
              <div className="md:col-span-2 mb-2 pb-2 border-b">
                <TypographyLarge>{selectedPersona.name}</TypographyLarge>
                {selectedPersona.description && (
                  <TypographyMuted className="mt-1">{selectedPersona.description}</TypographyMuted>
                )}
              </div>
            )}
            <div className="space-y-2">
              <TypographySmall className="text-muted-foreground">Lebenseinkommen</TypographySmall>
              <TypographyLarge>{formatCurrency(totalIncome)}</TypographyLarge>
            </div>
            <div className="space-y-2">
              <TypographySmall className="text-muted-foreground">Endvermögen</TypographySmall>
              <TypographyLarge>{formatCurrency(finalWealth)}</TypographyLarge>
            </div>
            <div className="space-y-2">
              <TypographySmall className="text-muted-foreground">Gesamte Steuern</TypographySmall>
              <TypographyLarge>{formatCurrency(totalTaxes)}</TypographyLarge>
            </div>
            <div className="space-y-2">
              <TypographySmall className="text-muted-foreground">Gesamte Ausgaben</TypographySmall>
              <TypographyLarge>{formatCurrency(totalSpending)}</TypographyLarge>
            </div>
          </div>

        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle>Vermögen und Einkommen</CardTitle>
          <CardDescription>Entwicklung über die Lebensjahre</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={createChartData(localResults)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="age" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <RechartsTooltip
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: "6px", border: "1px solid #e5e7eb" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="wealth"
                  name="Vermögen"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 0 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  name="Einkommen"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ r: 0 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="incomeTax"
                  name="Einkommensteuer"
                  stroke="#ffc658"
                  strokeWidth={2}
                  dot={{ r: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="income" className="space-y-4">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="income">Einkommensteuer</TabsTrigger>
          <TabsTrigger value="inheritance">Erbschaftssteuer</TabsTrigger>
          <TabsTrigger value="vat">Mehrwertsteuer</TabsTrigger>
          <TabsTrigger value="spending">Ausgaben</TabsTrigger>
        </TabsList>
        <TabsContent value="income">
          <Card className="shadow-md">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle>Einkommensteuer</CardTitle>
              <CardDescription>Gesamte Einkommensteuer: {formatCurrency(totalIncomeTax)}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={localResults}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="age" stroke="#6b7280" />
                    <YAxis yAxisId="left" stroke="#6b7280" />
                    <RechartsTooltip
                      formatter={(value) => formatCurrency(value as number)}
                      contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: "6px", border: "1px solid #e5e7eb" }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="income"
                      name="Einkommen"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 0 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="incomeTax"
                      name="Einkommensteuer"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      dot={{ r: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inheritance">
          <Card className="shadow-md">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle>Erbschaftssteuer</CardTitle>
              <CardDescription>Gesamte Erbschaftssteuer: {formatCurrency(totalInheritanceTax)}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={localResults}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="age" stroke="#6b7280" />
                    <YAxis yAxisId="left" stroke="#6b7280" />
                    <RechartsTooltip
                      formatter={(value) => formatCurrency(value as number)}
                      contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: "6px", border: "1px solid #e5e7eb" }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="inheritance"
                      name="Erbschaft"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 0 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="inheritanceTax"
                      name="Erbschaftssteuer"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      dot={{ r: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="vat">
          <Card className="shadow-md">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle>Mehrwertsteuer</CardTitle>
              <CardDescription>Gesamte Mehrwertsteuer: {formatCurrency(totalVAT)}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={localResults}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="age" stroke="#6b7280" />
                    <YAxis yAxisId="left" stroke="#6b7280" />
                    <RechartsTooltip
                      formatter={(value) => formatCurrency(value as number)}
                      contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: "6px", border: "1px solid #e5e7eb" }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="income"
                      name="Einkommen"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 0 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="vat"
                      name="Mehrwertsteuer"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      dot={{ r: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="spending">
          <Card className="shadow-md">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle>Ausgaben</CardTitle>
              <CardDescription>Gesamte Ausgaben: {formatCurrency(totalSpending)}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={localResults}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="age" stroke="#6b7280" />
                    <YAxis yAxisId="left" stroke="#6b7280" />
                    <RechartsTooltip
                      formatter={(value) => formatCurrency(value as number)}
                      contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: "6px", border: "1px solid #e5e7eb" }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="income"
                      name="Einkommen"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 0 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="spending"
                      name="Ausgaben"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      dot={{ r: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center mb-4">
        <TypographyH3>Detaillierte Daten</TypographyH3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetailedTable(!showDetailedTable)}
          className="flex items-center gap-2"
        >
          {showDetailedTable ? (
            <>
              <EyeOffIcon className="h-4 w-4" />
              <span>Tabelle ausblenden</span>
            </>
          ) : (
            <>
              <EyeIcon className="h-4 w-4" />
              <span>Tabelle anzeigen</span>
            </>
          )}
        </Button>
      </div>

      {showDetailedTable && (
        <Card className="shadow-md">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle>Detaillierte Einkommens- und Vermögensübersicht</CardTitle>
            <CardDescription>Bearbeiten Sie die Werte, um verschiedene Szenarien zu simulieren</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Alter</TableHead>
                    <TableHead className="font-medium">Einkommen (€)</TableHead>
                    <TableHead className="font-medium">Einkommensteuer (€)</TableHead>
                    <TableHead className="font-medium">Vermögen (€)</TableHead>
                    <TableHead className="font-medium">Vermögenszuwachs (€)</TableHead>
                    <TableHead className="font-medium">Erbschaft (€)</TableHead>
                    <TableHead className="font-medium">Erbschaftssteuer (€)</TableHead>
                    <TableHead className="font-medium">Mehrwertsteuer (€)</TableHead>
                    <TableHead className="font-medium">Ausgaben (€)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localResults.map((result) => (
                    <TableRow key={result.age}>
                      <TableCell className="font-medium">{result.age}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={result.income}
                          onChange={(e) => handleValueChange(result.age, "income", e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={result.incomeTax}
                          onChange={(e) => handleValueChange(result.age, "incomeTax", e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={result.wealth}
                          onChange={(e) => handleValueChange(result.age, "wealth", e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={result.wealthCreatedThisYear}
                          onChange={(e) => handleValueChange(result.age, "wealthCreatedThisYear", e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={result.inheritance}
                          onChange={(e) => handleValueChange(result.age, "inheritance", e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={result.inheritanceTax}
                          onChange={(e) => handleValueChange(result.age, "inheritanceTax", e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={result.vat}
                          onChange={(e) => handleValueChange(result.age, "vat", e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={result.spending}
                          onChange={(e) => handleValueChange(result.age, "spending", e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


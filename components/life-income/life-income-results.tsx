"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LifeIncomeResultsProps {
  results: {
    age: number
    income: number
    incomeTax: number
    wealth: number
    wealthCreatedThisYear: number
    inheritance: number
    inheritanceTax: number
    vat: number
    spending: number
  }[]
  setResults: React.Dispatch<
    React.SetStateAction<
      | {
          age: number
          income: number
          incomeTax: number
          wealth: number
          wealthCreatedThisYear: number
          inheritance: number
          inheritanceTax: number
          vat: number
          spending: number
        }[]
      | null
    >
  >
}

export function LifeIncomeResults({ results: initialResults, setResults }: LifeIncomeResultsProps) {
  const [localResults, setLocalResults] = useState(initialResults)

  useEffect(() => {
    setLocalResults(initialResults)
  }, [initialResults])

  const totalIncome = localResults.reduce((sum, result) => sum + result.income, 0)
  const totalIncomeTax = localResults.reduce((sum, result) => sum + result.incomeTax, 0)
  const totalInheritanceTax = localResults.reduce((sum, result) => sum + result.inheritanceTax, 0)
  const totalVAT = localResults.reduce((sum, result) => sum + result.vat, 0)
  const totalSpending = localResults.reduce((sum, result) => sum + result.spending, 0)
  const finalWealth = localResults[localResults.length - 1].wealth

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

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Lebenseinkommen Übersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold mb-2">Geschätztes Lebenseinkommen: {formatCurrency(totalIncome)}</p>
          <p className="text-2xl font-bold mb-2">Geschätztes Endvermögen: {formatCurrency(finalWealth)}</p>
          <p className="text-xl font-semibold mb-2">
            Gesamte Steuern: {formatCurrency(totalIncomeTax + totalInheritanceTax + totalVAT)}
          </p>
          <p className="text-xl font-semibold mb-2">Gesamte Ausgaben: {formatCurrency(totalSpending)}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="income" className="space-y-4">
        <TabsList>
          <TabsTrigger value="income">Einkommensteuer</TabsTrigger>
          <TabsTrigger value="inheritance">Erbschaftssteuer</TabsTrigger>
          <TabsTrigger value="vat">Mehrwertsteuer</TabsTrigger>
          <TabsTrigger value="spending">Ausgaben</TabsTrigger>
        </TabsList>
        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Einkommensteuer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold mb-4">Gesamte Einkommensteuer: {formatCurrency(totalIncomeTax)}</p>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={localResults}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis yAxisId="left" />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="income" name="Einkommen" stroke="#8884d8" />
                    <Line yAxisId="left" type="monotone" dataKey="incomeTax" name="Einkommensteuer" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inheritance">
          <Card>
            <CardHeader>
              <CardTitle>Erbschaftssteuer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold mb-4">
                Gesamte Erbschaftssteuer: {formatCurrency(totalInheritanceTax)}
              </p>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={localResults}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis yAxisId="left" />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="inheritance" name="Erbschaft" stroke="#8884d8" />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="inheritanceTax"
                      name="Erbschaftssteuer"
                      stroke="#82ca9d"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="vat">
          <Card>
            <CardHeader>
              <CardTitle>Mehrwertsteuer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold mb-4">Gesamte Mehrwertsteuer: {formatCurrency(totalVAT)}</p>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={localResults}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis yAxisId="left" />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="income" name="Einkommen" stroke="#8884d8" />
                    <Line yAxisId="left" type="monotone" dataKey="vat" name="Mehrwertsteuer" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="spending">
          <Card>
            <CardHeader>
              <CardTitle>Ausgaben</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold mb-4">Gesamte Ausgaben: {formatCurrency(totalSpending)}</p>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={localResults}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis yAxisId="left" />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="income" name="Einkommen" stroke="#8884d8" />
                    <Line yAxisId="left" type="monotone" dataKey="spending" name="Ausgaben" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Detaillierte Einkommens- und Vermögensübersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alter</TableHead>
                <TableHead>Einkommen (€)</TableHead>
                <TableHead>Einkommensteuer (€)</TableHead>
                <TableHead>Vermögen (€)</TableHead>
                <TableHead>Vermögenszuwachs (€)</TableHead>
                <TableHead>Erbschaft (€)</TableHead>
                <TableHead>Erbschaftssteuer (€)</TableHead>
                <TableHead>Mehrwertsteuer (€)</TableHead>
                <TableHead>Ausgaben (€)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localResults.map((result) => (
                <TableRow key={result.age}>
                  <TableCell>{result.age}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  )
}


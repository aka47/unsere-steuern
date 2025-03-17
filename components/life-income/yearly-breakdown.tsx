"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { type LifeIncomeYearlyResult } from "@/types/life-income"
import { TypographyH4, TypographyMuted } from "@/components/ui/typography"
import { ChevronLeft, ChevronRight, ArrowUpDown, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface YearlyBreakdownProps {
  results: LifeIncomeYearlyResult[] | null
  onResultsUpdate?: (updatedResults: LifeIncomeYearlyResult[]) => void
  editable?: boolean
}

type SortField = keyof LifeIncomeYearlyResult
type SortDirection = 'asc' | 'desc'

type SummaryStats = {
  totalIncome: number
  totalIncomeTax: number
  totalWealthCreated: number
  totalWealthIncome: number
  totalWealthTax: number
  finalWealth: number
  averageIncome: number
  averageWealthGrowth: number
  effectiveIncomeTaxRate: number
}

export function YearlyBreakdown({
  results,
  onResultsUpdate,
  editable = false
}: YearlyBreakdownProps) {
  const [editableResults, setEditableResults] = useState<LifeIncomeYearlyResult[] | null>(null)
  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('age')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [filterAge, setFilterAge] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('table')
  const itemsPerPage = 20

  useEffect(() => {
    if (results) {
      setEditableResults([...results])
      setCurrentPage(1) // Reset to first page when results change
      setFilterAge('') // Reset filter when results change
    } else {
      setEditableResults(null)
    }
  }, [results])

  // Calculate summary statistics
  const summaryStats: SummaryStats | null = useMemo(() => {
    if (!editableResults || editableResults.length === 0) return null

    const totalIncome = editableResults.reduce((sum, item) => sum + item.income, 0)
    const totalIncomeTax = editableResults.reduce((sum, item) => sum + item.incomeTax, 0)
    const totalWealthCreated = editableResults.reduce((sum, item) => sum + item.wealthGrowth, 0)
    const totalWealthIncome = editableResults.reduce((sum, item) => sum + item.wealthIncome, 0)
    const totalWealthTax = editableResults.reduce((sum, item) => sum + item.wealthTax, 0)
    const finalWealth = editableResults[editableResults.length - 1].wealth

    return {
      totalIncome,
      totalIncomeTax,
      totalWealthCreated,
      totalWealthIncome,
      totalWealthTax,
      finalWealth,
      averageIncome: totalIncome / editableResults.length,
      averageWealthGrowth: totalWealthCreated / editableResults.length,
      effectiveIncomeTaxRate: (totalIncomeTax / totalIncome) * 100
    }
  }, [editableResults])

  if (!editableResults || editableResults.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Jährliche Aufschlüsselung</CardTitle>
        </CardHeader>
        <CardContent>
          <TypographyMuted>
            Keine Daten verfügbar. Bitte berechnen Sie zuerst Ihr Lebenseinkommen.
          </TypographyMuted>
        </CardContent>
      </Card>
    )
  }

  const handleValueChange = (index: number, field: keyof LifeIncomeYearlyResult, value: string) => {
    if (!editableResults) return

    const numericValue = Number.parseFloat(value)
    if (Number.isNaN(numericValue) && field !== 'age') return

    const updatedResults = [...editableResults]
    updatedResults[index] = {
      ...updatedResults[index],
      [field]: field === 'age' ? Number.parseInt(value, 10) : numericValue
    }

    setEditableResults(updatedResults)
  }

  const handleSaveRow = (_index: number) => {
    setEditingRow(null)
    if (onResultsUpdate && editableResults) {
      onResultsUpdate(editableResults)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New field, default to ascending
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filter and sort the results
  const filteredResults = editableResults.filter(result => {
    if (!filterAge) return true
    return result.age.toString().includes(filterAge)
  })

  const sortedResults = [...filteredResults].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  // Calculate pagination
  const totalPages = Math.ceil(sortedResults.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, sortedResults.length)
  const currentItems = sortedResults.slice(startIndex, endIndex)

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Helper for sort button
  const SortButton = ({ field, label }: { field: SortField, label: string }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 p-0 h-auto font-medium"
    >
      {label}
      <ArrowUpDown className={`h-4 w-4 ${sortField === field ? 'opacity-100' : 'opacity-50'}`} />
    </Button>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Jährliche Aufschlüsselung</CardTitle>
        <TypographyMuted>
          Detaillierte Aufschlüsselung Ihres Einkommens und Vermögens von Jahr zu Jahr
        </TypographyMuted>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table">Tabelle</TabsTrigger>
            <TabsTrigger value="summary">Zusammenfassung</TabsTrigger>
          </TabsList> */}

          <TabsContent value="summary" className="mt-4">
            {summaryStats && (
              <div className="space-y-6">
                <div>
                  <TypographyH4>Gesamtübersicht</TypographyH4>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <Card>
                      <CardHeader className="py-4 px-6">
                        <CardTitle className="text-base">Gesamteinkommen</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-6">
                        <span className="text-2xl font-bold">{formatCurrency(summaryStats.totalIncome)}</span>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="py-4 px-6">
                        <CardTitle className="text-base">Gesamte Einkommensteuer</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-6">
                        <span className="text-2xl font-bold">{formatCurrency(summaryStats.totalIncomeTax)}</span>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="py-4 px-6">
                        <CardTitle className="text-base">Effektiver Steuersatz</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-6">
                        <span className="text-2xl font-bold">{formatPercentage(summaryStats.effectiveIncomeTaxRate)}</span>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <TypographyH4>Vermögensentwicklung</TypographyH4>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <Card>
                      <CardHeader className="py-4 px-6">
                        <CardTitle className="text-base">Endvermögen</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-6">
                        <span className="text-2xl font-bold">{formatCurrency(summaryStats.finalWealth)}</span>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="py-4 px-6">
                        <CardTitle className="text-base">Gesamter Vermögenszuwachs</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-6">
                        <span className="text-2xl font-bold">{formatCurrency(summaryStats.totalWealthCreated)}</span>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="py-4 px-6">
                        <CardTitle className="text-base">Vermögenseinkommen</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-6">
                        <span className="text-2xl font-bold">{formatCurrency(summaryStats.totalWealthIncome)}</span>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <TypographyH4>Durchschnittswerte</TypographyH4>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Card>
                      <CardHeader className="py-4 px-6">
                        <CardTitle className="text-base">Durchschnittliches Jahreseinkommen</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-6">
                        <span className="text-2xl font-bold">{formatCurrency(summaryStats.averageIncome)}</span>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="py-4 px-6">
                        <CardTitle className="text-base">Durchschnittlicher Vermögenszuwachs</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-6">
                        <span className="text-2xl font-bold">{formatCurrency(summaryStats.averageWealthGrowth)}</span>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="table" className="mt-4">
            <div className="flex flex-col space-y-4">
              {/* Filter controls */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nach Alter filtern..."
                    value={filterAge}
                    onChange={(e) => {
                      setFilterAge(e.target.value)
                      setCurrentPage(1) // Reset to first page on filter change
                    }}
                    className="pl-8"
                  />
                </div>
                <Select
                  value={sortField}
                  onValueChange={(value) => handleSort(value as SortField)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sortieren nach" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="age">Alter</SelectItem>
                    <SelectItem value="income">Einkommen</SelectItem>
                    <SelectItem value="incomeTax">Einkommensteuer</SelectItem>
                    <SelectItem value="wealth">Vermögen</SelectItem>
                    <SelectItem value="wealthIncome">Vermögenseinkommen</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center gap-1"
                >
                  {sortDirection === 'asc' ? 'Aufsteigend' : 'Absteigend'}
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <SortButton field="age" label="Alter" />
                      </TableHead>
                      <TableHead>
                        <SortButton field="income" label="Einkommen" />
                      </TableHead>
                      <TableHead>
                        <SortButton field="incomeTax" label="Einkommensteuer" />
                      </TableHead>
                      <TableHead>
                        <SortButton field="wealth" label="Vermögen" />
                      </TableHead>
                      <TableHead>
                        <SortButton field="wealthGrowth" label="Vermögenszuwachs" />
                      </TableHead>
                      <TableHead>
                        <SortButton field="wealthIncome" label="Vermögenseinkommen" />
                      </TableHead>
                      <TableHead>
                        <SortButton field="wealthTax" label="Vermögensteuer" />
                      </TableHead>
                      {editable && <TableHead>Aktionen</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((result, _index) => {
                      const actualIndex = editableResults.indexOf(result) // Find the actual index in the original array
                      return (
                        <TableRow key={actualIndex}>
                          <TableCell>
                            {editingRow === actualIndex ? (
                              <Input
                                type="number"
                                value={result.age}
                                onChange={(e) => handleValueChange(actualIndex, 'age', e.target.value)}
                                className="w-16"
                              />
                            ) : (
                              result.age
                            )}
                          </TableCell>
                          <TableCell>
                            {editingRow === actualIndex ? (
                              <Input
                                type="number"
                                value={result.income}
                                onChange={(e) => handleValueChange(actualIndex, 'income', e.target.value)}
                                className="w-24"
                              />
                            ) : (
                              formatCurrency(result.income)
                            )}
                          </TableCell>
                          <TableCell>
                            {editingRow === actualIndex ? (
                              <Input
                                type="number"
                                value={result.incomeTax}
                                onChange={(e) => handleValueChange(actualIndex, 'incomeTax', e.target.value)}
                                className="w-24"
                              />
                            ) : (
                              formatCurrency(result.incomeTax)
                            )}
                          </TableCell>
                          <TableCell>
                            {editingRow === actualIndex ? (
                              <Input
                                type="number"
                                value={result.wealth}
                                onChange={(e) => handleValueChange(actualIndex, 'wealth', e.target.value)}
                                className="w-24"
                              />
                            ) : (
                              formatCurrency(result.wealth)
                            )}
                          </TableCell>
                          <TableCell>
                            {editingRow === actualIndex ? (
                              <Input
                                type="number"
                                value={result.wealthGrowth}
                                onChange={(e) => handleValueChange(actualIndex, 'wealthGrowth', e.target.value)}
                                className="w-24"
                              />
                            ) : (
                              formatCurrency(result.wealthGrowth)
                            )}
                          </TableCell>
                          <TableCell>
                            {editingRow === actualIndex ? (
                              <Input
                                type="number"
                                value={result.wealthIncome}
                                onChange={(e) => handleValueChange(actualIndex, 'wealthIncome', e.target.value)}
                                className="w-24"
                              />
                            ) : (
                              formatCurrency(result.wealthIncome)
                            )}
                          </TableCell>
                          <TableCell>
                            {editingRow === actualIndex ? (
                              <Input
                                type="number"
                                value={result.wealthTax}
                                onChange={(e) => handleValueChange(actualIndex, 'wealthTax', e.target.value)}
                                className="w-24"
                              />
                            ) : (
                              formatCurrency(result.wealthTax)
                            )}
                          </TableCell>
                          {editable && (
                            <TableCell>
                              {editingRow === actualIndex ? (
                                <Button onClick={() => handleSaveRow(actualIndex)} size="sm">
                                  Speichern
                                </Button>
                              ) : (
                                <Button onClick={() => setEditingRow(actualIndex)} size="sm" variant="outline">
                                  Bearbeiten
                                </Button>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Seite {currentPage} von {totalPages} ({sortedResults.length} Einträge)
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Vorherige Seite</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Nächste Seite</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
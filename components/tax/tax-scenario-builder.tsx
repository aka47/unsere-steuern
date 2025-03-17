"use client"

import { useEffect } from "react"
import { useTaxScenario } from "@/hooks/useTaxScenario"
import { useTaxScenarioCalculator } from "@/hooks/useTaxScenarioCalculator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Slider } from "@/components/ui/slider"
// import { Switch } from "@/components/ui/switch"
import { TaxDistribution } from "@/types/life-income"
import { TaxRevenueChart } from "./tax-revenue-chart"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TAX_FREE_AMOUNTS = [0, 11000, 22000, 33000]
const WEALTH_TAX_RATES = [0, 0.01, 0.02, 0.03, 0.05, 0.1]
const WEALTH_INCOME_TAX_RATES = [0.10, 0.25, 0.30, 0.35, 0.42]

export const TaxScenarioBuilder = () => {
  const { results, calculateScenario } = useTaxScenarioCalculator()
  const { taxParams, setTaxParams } = useTaxScenario()

  // Calculate on mount
  useEffect(() => {
    calculateScenario(taxParams)
  }, [taxParams]) // Empty dependency array means this only runs once on mount

  const handleCalculate = () => {
    calculateScenario(taxParams)
  }

  const handleIncomeTaxChange = (field: keyof typeof taxParams.incomeTax, value: string | number) => {
    setTaxParams({
      ...taxParams,
      incomeTax: {
        ...taxParams.incomeTax,
        [field]: value
      }
    })
  }

  const handleWealthTaxChange = (field: keyof typeof taxParams.wealthTax, value: string | number) => {
    setTaxParams({
      ...taxParams,
      wealthTax: {
        ...taxParams.wealthTax,
        [field]: value
      }
    })
  }

  const handleInheritanceTaxChange = (field: keyof typeof taxParams.inheritanceTax, value: string | number) => {
    setTaxParams({
      ...taxParams,
      inheritanceTax: {
        ...taxParams.inheritanceTax,
        [field]: value
      }
    })
  }

  const handleWealthIncomeTaxChange = (value: string | number) => {
    setTaxParams({
      ...taxParams,
      wealthIncomeTax: {
        taxRate: Number(value)
      }
    })
  }

  // Calculate tax distribution from results
  const taxDistribution: TaxDistribution = results ? {
    incomeTax: results.totals.totalIncomeTax,
    vat: results.totals.totalVAT,
    wealthTax: results.totals.totalWealthTax,
    wealthIncomeTax: results.totals.totalWealthIncomeTax,
    total: results.totals.totalIncomeTax + results.totals.totalVAT +
          results.totals.totalWealthTax + results.totals.totalWealthIncomeTax
  } : {
    incomeTax: 0,
    vat: 0,
    wealthTax: 0,
    wealthIncomeTax: 0,
    total: 0
  }

  return (
    <div className="space-y-6">

      <TaxRevenueChart data={taxDistribution} />


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Income Tax Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Einkommensteuer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Steuerfreigrenze</label>
              <Select
                value={taxParams.incomeTax.taxFreeAmount.toString()}
                onValueChange={(value) => handleIncomeTaxChange("taxFreeAmount", Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TAX_FREE_AMOUNTS.map((amount) => (
                    <SelectItem key={amount} value={amount.toString()}>
                      {amount.toLocaleString()} €
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Steuersätze</label>
              <Select
                value={taxParams.incomeTax.taxLevel}
                onValueChange={(value) => handleIncomeTaxChange("taxLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lower">Niedriger</SelectItem>
                  <SelectItem value="current">Aktuell</SelectItem>
                  <SelectItem value="adenauer">Adenauer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Wealth Tax Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Vermögenssteuer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Steuerfreigrenze</label>
              <Select
                value={taxParams.wealthTax.taxFreeAmount.toString()}
                onValueChange={(value) => handleWealthTaxChange("taxFreeAmount", Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000000">1.000.000 €</SelectItem>
                  <SelectItem value="2000000">2.000.000 €</SelectItem>
                  <SelectItem value="3000000">3.000.000 €</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Steuersatz</label>
              <Select
                value={taxParams.wealthTax.taxRate.toString()}
                onValueChange={(value) => handleWealthTaxChange("taxRate", Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEALTH_TAX_RATES.map((rate) => (
                    <SelectItem key={rate} value={rate.toString()}>
                      {rate === 0 ? "0%" : `${(rate * 100).toFixed(1)}%`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inheritance Tax Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Erbschaftsteuer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Steuerfreigrenze</label>
              <Select
                value={taxParams.inheritanceTax.taxFreeAmount.toString()}
                onValueChange={(value) => handleInheritanceTaxChange("taxFreeAmount", Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="400000">400.000 €</SelectItem>
                  <SelectItem value="500000">500.000 €</SelectItem>
                  <SelectItem value="600000">600.000 €</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Steuersätze</label>
              <Select
                value={taxParams.inheritanceTax.taxLevel}
                onValueChange={(value) => handleInheritanceTaxChange("taxLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lower">Niedriger</SelectItem>
                  <SelectItem value="current">Aktuell</SelectItem>
                  <SelectItem value="higher">Höher</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>



       {/* We Tax Configuration */}
       <Card>
          <CardHeader>
            <CardTitle>Vermögenseinkünfte / Kapitalertragssteuer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Effektive Steuerquote</label>
              <Select
                value={taxParams.wealthIncomeTax?.taxRate.toString() || "0.10"}
                onValueChange={(value) => handleWealthIncomeTaxChange(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEALTH_INCOME_TAX_RATES.map((rate) => (
                    <SelectItem key={rate} value={rate.toString()}>
                      {(rate * 100).toFixed(0)}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>



      <div className="flex justify-center">
        <Button onClick={handleCalculate} className="w-full md:w-auto">
          Steuern berechnen
        </Button>
      </div>

      {/* Results Summary */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Ergebnisse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Gesamtsteuern</h3>
                <p className="text-2xl font-bold">
                  {taxDistribution.total.toLocaleString()} €
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Einkommensteuer</h3>
                <p className="text-2xl font-bold">
                  {taxDistribution.incomeTax.toLocaleString()} €
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Vermögensteuer</h3>
                <p className="text-2xl font-bold">
                  {taxDistribution.wealthTax.toLocaleString()} €
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Kapitalertragssteuer</h3>
                <p className="text-2xl font-bold">
                  {taxDistribution.wealthIncomeTax.toLocaleString()} €
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
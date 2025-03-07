import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaxDistribution } from "@/types/life-income"
import { TaxRevenueChart } from "./tax-revenue-chart"
import { useTaxScenarioCalculator } from "@/hooks/useTaxScenarioCalculator"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"

interface TaxScenarioBuilderProps {
  baseline: TaxDistribution
  target: TaxDistribution
  simulation: {
    params: {
      incomeTaxMultiplier: number
      vatRate: number
      wealthTaxRate: number
      wealthIncomeTaxRate: number
    }
    result: TaxDistribution
  }
}

interface TaxParams {
  incomeTax: {
    taxFreeAmount: number
    taxLevel: "lower" | "current" | "adenauer"
  }
  wealthTax: {
    taxFreeAmount: number
    taxRate: number
  }
  inheritanceTax: {
    taxFreeAmount: number
    taxLevel: "lower" | "current" | "higher"
  }
}

const TAX_FREE_AMOUNTS = [0, 11000, 22000, 33000]
const WEALTH_TAX_RATES = [0.01, 0.02, 0.03, 0.05]

export const TaxScenarioBuilder = ({ baseline, target, simulation }: TaxScenarioBuilderProps) => {
  const { results, calculateScenario } = useTaxScenarioCalculator()
  const [taxParams, setTaxParams] = useState<TaxParams>({
    incomeTax: {
      taxFreeAmount: 11000,
      taxLevel: "current"
    },
    wealthTax: {
      taxFreeAmount: 1000000,
      taxRate: 0.02
    },
    inheritanceTax: {
      taxFreeAmount: 400000,
      taxLevel: "current"
    }
  })

  const handleCalculate = useCallback(() => {
    calculateScenario(taxParams)
  }, [calculateScenario, taxParams])

  const handleIncomeTaxChange = useCallback((field: keyof TaxParams["incomeTax"], value: any) => {
    setTaxParams(prev => ({
      ...prev,
      incomeTax: {
        ...prev.incomeTax,
        [field]: value
      }
    }))
  }, [])

  const handleWealthTaxChange = useCallback((field: keyof TaxParams["wealthTax"], value: any) => {
    setTaxParams(prev => ({
      ...prev,
      wealthTax: {
        ...prev.wealthTax,
        [field]: value
      }
    }))
  }, [])

  const handleInheritanceTaxChange = useCallback((field: keyof TaxParams["inheritanceTax"], value: any) => {
    setTaxParams(prev => ({
      ...prev,
      inheritanceTax: {
        ...prev.inheritanceTax,
        [field]: value
      }
    }))
  }, [])

  // Calculate tax distribution from results
  const taxDistribution: TaxDistribution = results ? {
    incomeTax: results.totals.totalIncomeTax,
    vat: results.totals.totalVAT,
    wealthTax: results.totals.totalWealthTax,
    wealthIncomeTax: results.totals.totalWealthIncomeTax,
    total: results.totals.totalIncomeTax + results.totals.totalVAT +
          results.totals.totalWealthTax + results.totals.totalWealthIncomeTax
  } : simulation.result

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Steueraufkommen</CardTitle>
        </CardHeader>
        <CardContent>
          <TaxRevenueChart data={taxDistribution} />
        </CardContent>
      </Card>

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
                onValueChange={(value) => handleIncomeTaxChange("taxFreeAmount", parseInt(value))}
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
                onValueChange={(value) => handleWealthTaxChange("taxFreeAmount", parseInt(value))}
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
                onValueChange={(value) => handleWealthTaxChange("taxRate", parseFloat(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEALTH_TAX_RATES.map((rate) => (
                    <SelectItem key={rate} value={rate.toString()}>
                      {(rate * 100).toFixed(1)}%
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
                onValueChange={(value) => handleInheritanceTaxChange("taxFreeAmount", parseInt(value))}
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
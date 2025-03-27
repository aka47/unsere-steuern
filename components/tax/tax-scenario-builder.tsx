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
import { TaxScenarioDetails } from "@/components/tax-scenarios/tax-scenario-details"
import { grokPersonasCollection } from "@/types/personaCollection"
import { PersonaCollection } from "@/types/personaCollection"
import { incomeTaxLevels, wealthTaxLevels, vatLevels, wealthIncomeTaxLevels } from "@/constants/tax-scenarios"
import { TaxParams } from "@/hooks/useTaxScenario"
import { INHERITANCE_TAX_CLASSES } from "@/constants/tax"

const TAX_FREE_AMOUNTS = [0, 11000, 22000, 33000]
const WEALTH_TAX_RATES = [0, 0.01, 0.02, 0.03, 0.05, 0.1]
const WEALTH_INCOME_TAX_RATES = [0.10, 0.25, 0.30, 0.35, 0.42]

interface TaxScenarioBuilderProps {
  collection?: PersonaCollection
  usePersonaSize?: boolean
}

export const TaxScenarioBuilder = ({ collection = grokPersonasCollection, usePersonaSize = false }: TaxScenarioBuilderProps) => {
  const { results, calculateScenario } = useTaxScenarioCalculator(undefined, collection, usePersonaSize)
  const { taxParams, setTaxParams } = useTaxScenario()

  // Calculate on mount
  useEffect(() => {
    calculateScenario(taxParams)
  }, [taxParams]) // Empty dependency array means this only runs once on mount

  const handleCalculate = () => {
    calculateScenario(taxParams)
  }

  const handleIncomeTaxChange = (value: string) => {
    setTaxParams({
      ...taxParams,
      incomeTax: {
        ...taxParams.incomeTax,
        taxLevel: value as keyof typeof incomeTaxLevels
      }
    })
  }

  const handleWealthTaxChange = (value: string) => {
    setTaxParams({
      ...taxParams,
      wealthTax: {
        ...taxParams.wealthTax,
        taxLevel: value as keyof typeof wealthTaxLevels
      }
    })
  }

  const handleVATChange = (value: string) => {
    setTaxParams({
      ...taxParams,
      vatTax: {
        ...taxParams.vatTax,
        taxLevel: value as keyof typeof vatLevels
      }
    })
  }

  const handleTaxParamChange = (
    taxType: keyof TaxParams,
    param: keyof TaxParams[keyof TaxParams],
    value: TaxParams[keyof TaxParams][keyof TaxParams[keyof TaxParams]]
  ) => {
    setTaxParams((prev) => ({
      ...prev,
      [taxType]: {
        ...prev[taxType],
        [param]: value
      }
    }))
  }

  const handleInheritanceTaxChange = (field: keyof typeof taxParams.inheritanceTax, value: string | number) => {
    setTaxParams((prev) => ({
      ...prev,
      inheritanceTax: {
        ...prev.inheritanceTax,
        [field]: value
      }
    }))
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
              <label className="text-sm font-medium">Steuersystem</label>
              <Select
                value={taxParams.incomeTax.taxLevel}
                onValueChange={handleIncomeTaxChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(incomeTaxLevels).map(([key, level]) => (
                    <SelectItem key={key} value={key}>
                      {level.name}
                    </SelectItem>
                  ))}
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
              <label className="text-sm font-medium">Steuersystem</label>
              <Select
                value={taxParams.wealthTax.taxLevel}
                onValueChange={handleWealthTaxChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(wealthTaxLevels).map(([key, level]) => (
                    <SelectItem key={key} value={key}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* VAT Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Mehrwertsteuer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Steuersystem</label>
              <Select
                value={taxParams.vatTax.taxLevel}
                onValueChange={handleVATChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(vatLevels).map(([key, level]) => (
                    <SelectItem key={key} value={key}>
                      {level.name}
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
                value={taxParams.inheritanceTax.taxLevel.toString()}
                onValueChange={(value) => handleInheritanceTaxChange("taxLevel", Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Niedriger</SelectItem>
                  <SelectItem value="2">Aktuell</SelectItem>
                  <SelectItem value="3">Höher</SelectItem>
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
              <label className="text-sm font-medium">Steuersystem</label>
              <Select
                value={taxParams.wealthIncomeTax.taxLevel}
                onValueChange={(value) => handleTaxParamChange("wealthIncomeTax", "taxLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(wealthIncomeTaxLevels).map(([key, level]) => (
                    <SelectItem key={key} value={key}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* <div className="flex justify-center">
        <Button onClick={handleCalculate} className="w-full md:w-auto">
          Steuern berechnen
        </Button>
      </div> */}

      <TaxScenarioDetails collection={collection} />

    </div>
  )
}
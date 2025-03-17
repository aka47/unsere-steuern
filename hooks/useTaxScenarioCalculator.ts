import { useState, useCallback } from "react"
import { TaxDistribution } from "@/types/life-income"
import { Persona } from "@/types/persona"
import { InheritanceTaxClass } from "@/types/inheritance-tax"
import { grokPersonas } from "@/types/persona"
import { useLifeIncomeCalculator, type LifeIncomeCalculatorResult } from "./useLifeIncomeCalculator"
import { type TaxScenario } from "@/types/life-income"

// Common tax bracket calculation function
const calculateTaxWithBrackets = (amount: number, brackets: Array<[number, number]>) => {
  let tax = 0
  for (let i = 0; i < brackets.length - 1; i++) {
    const [lowerLimit, rate] = brackets[i]
    const [upperLimit] = brackets[i + 1]
    if (amount > lowerLimit) {
      const taxableAmount = Math.min(amount - lowerLimit, upperLimit - lowerLimit)
      tax += taxableAmount * rate
    }
  }
  return tax
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
  wealthIncomeTax: {
    taxRate: number
  }
}

// Predefined tax brackets
const TAX_BRACKETS = {
  income: {
    lower: [
      [12096, 0.00],
      [17443, 0.08],
      [68480, 0.18],
      [277825, 0.36],
      [Number.POSITIVE_INFINITY, 0.39]
    ] as Array<[number, number]>,
    current: [
      [12096, 0],
      [17443, 0.14],
      [68480, 0.24],
      [277825, 0.42],
      [Number.POSITIVE_INFINITY, 0.45],
    ] as Array<[number, number]>,
    adenauer: [
      [8000, 0],
      [16000, 0.20],
      [32000, 0.30],
      [64000, 0.40],
      [120000, 0.48],
      [Number.POSITIVE_INFINITY, 0.53],
    ] as Array<[number, number]>,
  },
  inheritance: {
    lower: [
      [75000, 0.04],
      [300000, 0.07],
      [600000, 0.10],
      [6000000, 0.13],
      [13000000, 0.16],
      [26000000, 0.19],
      [Number.POSITIVE_INFINITY, 0.22]
    ] as Array<[number, number]>,
    current: [
      [75000, 0.07],
      [300000, 0.11],
      [600000, 0.15],
      [6000000, 0.19],
      [13000000, 0.23],
      [26000000, 0.27],
      [Number.POSITIVE_INFINITY, 0.30],
    ] as Array<[number, number]>,
    higher: [
      [75000, 0.10],
      [300000, 0.15],
      [600000, 0.20],
      [6000000, 0.25],
      [13000000, 0.30],
      [26000000, 0.35],
      [Number.POSITIVE_INFINITY, 0.40],
    ] as Array<[number, number]>,
  },
}

export function useTaxScenarioCalculator() {
  const [results, setResults] = useState<LifeIncomeCalculatorResult | null>(null)
  const { calculateLifeIncome } = useLifeIncomeCalculator()

  const createCustomTaxScenario = useCallback((params: TaxParams): TaxScenario => {
    return {
      id: "custom",
      name: "Deine Steuer",
      description: "Gestalte dein eigenes Steuersystem",
      detailedDescription: "Passe die Steuerparameter an, um dein eigenes Steuersystem zu erstellen.",

      calculateIncomeTax: (income: number) => {
        const adjustedIncome = Math.max(0, income - params.incomeTax.taxFreeAmount)
        return calculateTaxWithBrackets(adjustedIncome, TAX_BRACKETS.income[params.incomeTax.taxLevel])
      },

      calculateInheritanceTax: (inheritanceTaxableHousingFinancial: number, inheritanceTaxableCompany: number, inheritanceHardship: boolean, taxClass: InheritanceTaxClass) => {
        const adjustedAmount = Math.max(0, inheritanceTaxableHousingFinancial + inheritanceTaxableCompany - params.inheritanceTax.taxFreeAmount)
        return calculateTaxWithBrackets(adjustedAmount, TAX_BRACKETS.inheritance[params.inheritanceTax.taxLevel])
      },

      calculateWealthTax: (wealth: number) => {
        const adjustedWealth = Math.max(0, wealth - params.wealthTax.taxFreeAmount)
        return adjustedWealth * (params.wealthTax.taxRate / 100)
      },

      calculateWealthIncomeTax: (wealthIncome: number) => {
        return wealthIncome * params.wealthIncomeTax.taxRate
      },

      calculateVAT: (income: number, vatRate: number, vatApplicableRate: number) => {
        const grossSpending = income * (vatApplicableRate / 100)
        return grossSpending * (vatRate / (100 + vatRate))
      }
    }
  }, [])

  const calculateScenario = useCallback((params: TaxParams) => {
    const customTaxScenario = createCustomTaxScenario(params)

    // Calculate results for each persona
    const personaResults = grokPersonas.map(persona => {
      const result = calculateLifeIncome({
        currentIncome: persona.currentIncome,
        currentAge: persona.currentAge,
        savingsRate: persona.savingsRate,
        inheritanceAge: persona.inheritanceAge || 20,
        inheritanceAmount: persona.inheritanceAmount,
        inheritanceTaxClass: persona.inheritanceTaxClass,
        vatRate: persona.vatRate,
        vatApplicableRate: persona.vatApplicableRate,
        yearlySpendingFromWealth: persona.yearlySpendingFromWealth,
        currentWealth: persona.currentWealth,
        currentPersona: persona,
        initialAge: persona.initialAge,
        currentIncomeFromWealth: persona.currentIncomeFromWealth,
        taxScenario: customTaxScenario,
        inheritanceTaxableHousingFinancial: persona.inheritanceHousing,
        inheritanceTaxableCompany: persona.inheritanceCompany,
        inheritanceHardship: false
      })
      return result
    }).filter((result): result is NonNullable<typeof result> => result !== null)

    // Calculate average results
    const avgResult = personaResults.reduce((acc, result) => ({
      totals: {
        totalWealth: acc.totals.totalWealth + result.totals.totalWealth,
        totalIncome: acc.totals.totalIncome + result.totals.totalIncome,
        totalIncomeTax: acc.totals.totalIncomeTax + result.totals.totalIncomeTax,
        totalWealthIncome: acc.totals.totalWealthIncome + result.totals.totalWealthIncome,
        totalWealthIncomeTax: acc.totals.totalWealthIncomeTax + result.totals.totalWealthIncomeTax,
        totalWealthTax: acc.totals.totalWealthTax + result.totals.totalWealthTax,
        totalVAT: acc.totals.totalVAT + result.totals.totalVAT,
        totalInheritance: acc.totals.totalInheritance + result.totals.totalInheritance,
        totalInheritanceTax: acc.totals.totalInheritanceTax + result.totals.totalInheritanceTax,
        totalSpending: acc.totals.totalSpending + result.totals.totalSpending,
        totalSavings: acc.totals.totalSavings + result.totals.totalSavings,
        totalSpendingFromWealth: acc.totals.totalSpendingFromWealth + result.totals.totalSpendingFromWealth,
        totalSpendingFromIncome: acc.totals.totalSpendingFromIncome + result.totals.totalSpendingFromIncome,
        totalTax: acc.totals.totalTax + result.totals.totalTax,
        totalWealthGrowth: acc.totals.totalWealthGrowth + result.totals.totalWealthGrowth
      },
      details: result.details,
    }), {
      totals: {
        totalWealth: 0,
        totalIncome: 0,
        totalIncomeTax: 0,
        totalWealthIncome: 0,
        totalWealthIncomeTax: 0,
        totalWealthTax: 0,
        totalVAT: 0,
        totalInheritance: 0,
        totalInheritanceTax: 0,
        totalSpending: 0,
        totalSavings: 0,
        totalSpendingFromWealth: 0,
        totalSpendingFromIncome: 0,
        totalTax: 0,
        totalWealthGrowth: 0
      },
      details: [],
    })

    // Divide by number of personas to get average
    const numPersonas = personaResults.length
    Object.keys(avgResult.totals).forEach(key => {
      avgResult.totals[key as keyof typeof avgResult.totals] /= numPersonas
    })

    setResults(avgResult)
    return avgResult
  }, [calculateLifeIncome, createCustomTaxScenario])

  return { calculateScenario, results, createCustomTaxScenario }
}
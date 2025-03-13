import { useState, useCallback } from "react"
import { TaxDistribution } from "@/types/life-income"
import { Persona } from "@/types/persona"
import { InheritanceTaxClass } from "@/types/inheritance-tax"
import { grokPersonas } from "@/types/persona"
import { useLifeIncomeCalculator, type LifeIncomeCalculatorResult } from "./useLifeIncomeCalculator"
import { type TaxScenario } from "@/types/life-income"


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

export function useTaxScenarioCalculator() {
  const [results, setResults] = useState<LifeIncomeCalculatorResult | null>(null)
  const { calculateLifeIncome } = useLifeIncomeCalculator()

  const createCustomTaxScenario = useCallback((params: TaxParams): TaxScenario => {
    // Income tax brackets based on tax level
    const incomeTaxBrackets = {
      lower: [
        [12096, 0],
        [17443, 0.14],
        [68480, 0.24],
        [277825, 0.42],
        [Number.POSITIVE_INFINITY, 0.45],
      ],
      current: [
        [12096, 0],
        [17443, 0.14],
        [68480, 0.24],
        [277825, 0.42],
        [Number.POSITIVE_INFINITY, 0.45],
      ],
      adenauer: [
        [8000, 0],
        [16000, 0.20],
        [32000, 0.30],
        [64000, 0.40],
        [120000, 0.48],
        [Number.POSITIVE_INFINITY, 0.53],
      ],
    }

    // Inheritance tax brackets based on tax level
    const inheritanceTaxBrackets = {
      lower: [
        [75000, 0.07],
        [300000, 0.11],
        [600000, 0.15],
        [6000000, 0.19],
        [13000000, 0.23],
        [26000000, 0.27],
        [Number.POSITIVE_INFINITY, 0.30],
      ],
      current: [
        [75000, 0.07],
        [300000, 0.11],
        [600000, 0.15],
        [6000000, 0.19],
        [13000000, 0.23],
        [26000000, 0.27],
        [Number.POSITIVE_INFINITY, 0.30],
      ],
      higher: [
        [75000, 0.10],
        [300000, 0.15],
        [600000, 0.20],
        [6000000, 0.25],
        [13000000, 0.30],
        [26000000, 0.35],
        [Number.POSITIVE_INFINITY, 0.40],
      ],
    }

    return {
      id: "custom",
      name: "Deine Steuer",
      description: "Gestalte dein eigenes Steuersystem",
      detailedDescription: "Passe die Steuerparameter an, um dein eigenes Steuersystem zu erstellen.",

      calculateIncomeTax: (income: number) => {
        const brackets = incomeTaxBrackets[params.incomeTax.taxLevel]
        const adjustedIncome = Math.max(0, income - params.incomeTax.taxFreeAmount)

        let tax = 0
        for (let i = 0; i < brackets.length - 1; i++) {
          const [lowerLimit, rate] = brackets[i]
          const [upperLimit] = brackets[i + 1]
          if (adjustedIncome > lowerLimit) {
            const taxableAmount = Math.min(adjustedIncome - lowerLimit, upperLimit - lowerLimit)
            tax += taxableAmount * rate
          }
        }
        return tax
      },

      calculateInheritanceTax: (inheritanceTaxableHousingFinancial: number, inheritanceTaxableCompany: number, inheritanceHardship: boolean, taxClass: InheritanceTaxClass) => {
        const brackets = inheritanceTaxBrackets[params.inheritanceTax.taxLevel]

        const adjustedAmount = Math.max(0, inheritanceTaxableHousingFinancial + inheritanceTaxableCompany - params.inheritanceTax.taxFreeAmount)

        let tax = 0
        for (let i = 0; i < brackets.length - 1; i++) {
          const [lowerLimit, rate] = brackets[i]
          const [upperLimit] = brackets[i + 1]
          if (adjustedAmount > lowerLimit) {
            const taxableAmount = Math.min(adjustedAmount - lowerLimit, upperLimit - lowerLimit)
            tax += taxableAmount * rate
          }
        }
        return tax
      },

      calculateWealthTax: (wealth: number) => {
        const adjustedWealth = Math.max(0, wealth - params.wealthTax.taxFreeAmount)
        return adjustedWealth * params.wealthTax.taxRate
      },

      calculateWealthIncomeTax: (wealthIncome: number) => {
        // Using a flat rate for wealth income tax
        return wealthIncome * 0.26375 // 26.375% flat rate
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
        inheritanceHardship: false // Default to false as it's not in the Persona type
      })
      return result
    }).filter((result): result is NonNullable<typeof result> => result !== null)

    // Aggregate results
    const totalDistribution: TaxDistribution = {
      incomeTax: personaResults.reduce((sum, result) => sum + result.totals.totalIncomeTax, 0),
      vat: personaResults.reduce((sum, result) => sum + result.totals.totalVAT, 0),
      wealthTax: personaResults.reduce((sum, result) => sum + result.totals.totalWealthTax, 0),
      wealthIncomeTax: personaResults.reduce((sum, result) => sum + result.totals.totalWealthIncomeTax, 0),
      total: personaResults.reduce((sum, result) =>
        sum + result.totals.totalIncomeTax + result.totals.totalVAT +
        result.totals.totalWealthTax + result.totals.totalWealthIncomeTax, 0
      ),
    }

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
      },
      details: [],
    })

    // Divide by number of personas to get average
    const numPersonas = personaResults.length
    avgResult.totals.totalWealth /= numPersonas
    avgResult.totals.totalIncome /= numPersonas
    avgResult.totals.totalIncomeTax /= numPersonas
    avgResult.totals.totalWealthIncome /= numPersonas
    avgResult.totals.totalWealthIncomeTax /= numPersonas
    avgResult.totals.totalWealthTax /= numPersonas
    avgResult.totals.totalVAT /= numPersonas
    avgResult.totals.totalInheritance /= numPersonas
    avgResult.totals.totalInheritanceTax /= numPersonas
    avgResult.totals.totalSpending /= numPersonas
    avgResult.totals.totalSavings /= numPersonas
    avgResult.totals.totalSpendingFromWealth /= numPersonas
    avgResult.totals.totalSpendingFromIncome /= numPersonas

    setResults(avgResult)
    return avgResult
  }, [calculateLifeIncome, createCustomTaxScenario])

  return { calculateScenario, results }
}
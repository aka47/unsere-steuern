import { useState, useCallback } from "react"
import { TaxDistribution, type LifeIncomeTotals } from "@/types/life-income"
import { Persona } from "@/types/persona"
import { InheritanceTaxClass } from "@/types/inheritance-tax"
import { grokPersonas } from "@/types/persona"
import { useLifeIncomeCalculator, type LifeIncomeCalculatorResult } from "./useLifeIncomeCalculator"
import { type TaxScenario } from "@/types/life-income"
import { useTaxScenario } from "./useTaxScenario"
import { PersonaCollection } from "@/types/personaCollection"
import {
  calculateIncomeTaxFromBrackets,
  calculateWealthTaxFromBrackets,
  calculateVATFromBrackets,
  statusQuoScenario,
  incomeTaxLevels,
  wealthTaxLevels,
  vatLevels,
  calculateWealthIncomeTaxFromBrackets,
  wealthIncomeTaxLevels
} from "@/constants/tax-scenarios"

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
    taxLevel: keyof typeof incomeTaxLevels
  }
  wealthTax: {
    taxLevel: keyof typeof wealthTaxLevels
  }
  inheritanceTax: {
    taxLevel: InheritanceTaxClass
  }
  wealthIncomeTax: {
    taxLevel: keyof typeof incomeTaxLevels
  }
  vatTax: {
    taxLevel: keyof typeof vatLevels
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

export function useTaxScenarioCalculator(
  scenarioOverride?: TaxScenario,
  collection?: PersonaCollection,
  usePersonaSize: boolean = false
) {
  const [results, setResults] = useState<LifeIncomeCalculatorResult | null>(null)
  const { calculateLifeIncome } = useLifeIncomeCalculator()
  const { selectedTaxScenario } = useTaxScenario()

  // Calculate persona size based on collection size and number of personas
  const collectionSize = collection?.size || 42e6
  const personaSize = collectionSize / (collection?.personas.length || 1)

  const createCustomTaxScenario = useCallback((params: TaxParams): TaxScenario => {
    return {
      id: "custom",
      name: "Deine Steuer",
      description: "Gestalte dein eigenes Steuersystem",
      detailedDescription: "Passe die Steuerparameter an, um dein eigenes Steuersystem zu erstellen.",

      calculateIncomeTax: (income: number) => {
        return calculateIncomeTaxFromBrackets(income, params.incomeTax.taxLevel)
      },

      calculateInheritanceTax: (inheritanceTaxableHousingFinancial: number, inheritanceTaxableCompany: number, inheritanceHardship: boolean, taxClass: InheritanceTaxClass) => {
        return statusQuoScenario.calculateInheritanceTax(inheritanceTaxableHousingFinancial, inheritanceTaxableCompany, inheritanceHardship, taxClass)
      },

      calculateWealthTax: (wealth: number) => {
        return calculateWealthTaxFromBrackets(wealth, params.wealthTax.taxLevel)
      },

      calculateWealthIncomeTax: (wealthIncome: number) => {
        return calculateWealthIncomeTaxFromBrackets(wealthIncome, params.wealthIncomeTax.taxLevel as "status-quo" | "lower" | "higher" | "highest")
      },

      calculateVAT: (income: number, vatRate: number, vatApplicableRate: number) => {
        return calculateVATFromBrackets(income, vatRate, vatApplicableRate, params.vatTax.taxLevel)
      }
    }
  }, [])

  const calculateScenario = useCallback((params: TaxParams) => {
    // Use the override scenario if provided, otherwise use selected or custom
    const taxScenario = scenarioOverride || (selectedTaxScenario.id === "custom" ? createCustomTaxScenario(params) : selectedTaxScenario)

    // Calculate results for each persona
    const personaResults = (collection?.personas || []).map(persona => {
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
        taxScenario,
        inheritanceTaxableHousingFinancial: persona.inheritanceHousing,
        inheritanceTaxableCompany: persona.inheritanceCompany,
        inheritanceHardship: false,
        personaSize: usePersonaSize ? personaSize : undefined
      })
      return { result, persona }
    }).filter((item): item is { result: NonNullable<typeof item.result>, persona: Persona } => item.result !== null)

    // Initialize totals
    const totals: LifeIncomeTotals = {
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
      totalTaxWithVAT: 0,
      totalWealthGrowth: 0
    }

    // Sum up current year results for all personas
    personaResults.forEach(({ result, persona }) => {
      // Find current year's result
      const currentYearResult = result.details.find(detail => detail.age === persona.currentAge)
      if (!currentYearResult) return

      // Calculate current year values
      const income = currentYearResult.income
      const incomeTax = currentYearResult.incomeTax
      const wealthIncome = currentYearResult.wealthIncome
      const wealthIncomeTax = taxScenario.calculateWealthIncomeTax(wealthIncome)
      const wealthTax = currentYearResult.wealthTax
      const vat = currentYearResult.vat
      const inheritance = currentYearResult.age === persona.inheritanceAge ? currentYearResult.inheritance : 0
      const inheritanceTax = currentYearResult.age === persona.inheritanceAge ? currentYearResult.inheritanceTax : 0
      const spending = currentYearResult.spending
      const savings = currentYearResult.savings
      const spendingFromWealth = persona.yearlySpendingFromWealth
      const spendingFromIncome = spending - spendingFromWealth
      const wealthGrowth = currentYearResult.wealthGrowth
      const wealth = currentYearResult.wealth

      // Add to totals
      totals.totalWealth += wealth
      totals.totalIncome += income
      totals.totalIncomeTax += incomeTax
      totals.totalWealthIncome += wealthIncome
      totals.totalWealthIncomeTax += wealthIncomeTax
      totals.totalWealthTax += wealthTax
      totals.totalVAT += vat
      totals.totalInheritance += inheritance
      totals.totalInheritanceTax += inheritanceTax
      totals.totalSpending += spending
      totals.totalSavings += savings
      totals.totalSpendingFromWealth += spendingFromWealth
      totals.totalSpendingFromIncome += spendingFromIncome
      totals.totalTax += incomeTax + wealthTax + inheritanceTax + wealthIncomeTax
      totals.totalTaxWithVAT += incomeTax + wealthTax + inheritanceTax + wealthIncomeTax + vat
      totals.totalWealthGrowth += wealthGrowth
    })

    // If we're not using persona size, calculate averages
    if (!usePersonaSize && personaResults.length > 0) {
      const personaCount = personaResults.length
      Object.keys(totals).forEach(key => {
        totals[key as keyof LifeIncomeTotals] = Math.round(totals[key as keyof LifeIncomeTotals] / personaCount)
      })
    }

    // Create result object with the same interface as before
    const result: LifeIncomeCalculatorResult = {
      totals,
      details: personaResults.map(({ result }) => result.details).flat()
    }

    setResults(result)
    return result
  }, [calculateLifeIncome, createCustomTaxScenario, selectedTaxScenario, collection, usePersonaSize, personaSize])

  return { calculateScenario, results, createCustomTaxScenario }
}
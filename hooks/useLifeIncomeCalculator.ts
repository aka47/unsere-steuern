import { INHERITANCE_TAX_CLASSES, TAX_BRACKETS } from "@/constants/tax"
import { type Persona } from "@/types/persona"

export type LifeIncomeResult = {
  age: number
  income: number
  incomeTax: number
  wealth: number
  wealthCreatedThisYear: number
  inheritance: number
  inheritanceTax: number
  vat: number
  spending: number
}

type CalculateLifeIncomeParams = {
  currentIncome: number
  currentAge: number
  savingsRate: number
  inheritanceAge?: number
  inheritanceAmount: number
  inheritanceTaxClass: keyof typeof INHERITANCE_TAX_CLASSES
  vatRate: number
  vatApplicableRate: number
  yearlySpending: number
  selectedPersona: Persona | null
}

type LifeIncomeTotals = {
  totalWealth: number
  totalIncome: number
  totalIncomeTax: number
  totalVAT: number
  totalInheritance: number
  totalInheritanceTax: number
  totalSpending: number
}

type LifeIncomeCalculatorResult = {
  totals: LifeIncomeTotals
  details: LifeIncomeResult[]
}

export function useLifeIncomeCalculator() {
  const calculateIncomeTax = (income: number) => {
    let tax = 0
    let remainingIncome = income

    for (const bracket of TAX_BRACKETS) {
      if (remainingIncome > bracket.limit) {
        const taxableAmount = Math.min(remainingIncome - bracket.limit, bracket.limit)
        tax += taxableAmount * bracket.rate
        remainingIncome -= taxableAmount
      } else {
        break
      }
    }

    return tax
  }

  const calculateInheritanceTax = (amount: number, taxClass: keyof typeof INHERITANCE_TAX_CLASSES) => {
    let tax = 0
    let remainingAmount = amount

    for (const bracket of INHERITANCE_TAX_CLASSES[taxClass]) {
      if (remainingAmount > bracket.limit) {
        const taxableAmount = Math.min(remainingAmount - bracket.limit, bracket.limit)
        tax += taxableAmount * bracket.rate
        remainingAmount -= taxableAmount
      } else {
        break
      }
    }

    return tax
  }

  const calculateVAT = (income: number, vatRate: number, vatApplicableRate: number) => {
    const grossSpending = income * (vatApplicableRate / 100)
    return grossSpending * (vatRate / (100 + vatRate))
  }

  const calculateLifeIncome = ({
    currentIncome,
    currentAge,
    savingsRate,
    inheritanceAge,
    inheritanceAmount,
    inheritanceTaxClass,
    vatRate,
    vatApplicableRate,
    yearlySpending,
    selectedPersona,
  }: CalculateLifeIncomeParams): LifeIncomeCalculatorResult | null => {
    if (
      isNaN(currentIncome) ||
      isNaN(currentAge) ||
      currentAge < 20 ||
      currentAge > 65 ||
      isNaN(savingsRate) ||
      savingsRate < 0 ||
      savingsRate > 1 ||
      isNaN(vatRate) ||
      isNaN(vatApplicableRate) ||
      isNaN(yearlySpending)
    ) {
      return null
    }

    // Default growth rate if no persona or no incomeGrowth function
    const defaultGrowthRate = () => 1.02
    const growthRate = selectedPersona?.incomeGrowth || defaultGrowthRate
    const wealthGrowthRate = 0.05
    const results: LifeIncomeResult[] = []
    let totalWealth = 0

    // Initialize totals
    const totals: LifeIncomeTotals = {
      totalWealth: 0,
      totalIncome: 0,
      totalIncomeTax: 0,
      totalVAT: 0,
      totalInheritance: 0,
      totalInheritanceTax: 0,
      totalSpending: 0
    }

    for (let i = currentAge; i <= 65; i++) {
      const yearIncome = currentIncome * Math.pow(typeof growthRate === 'function' ? growthRate(i) : defaultGrowthRate(), i - currentAge)
      const incomeTax = calculateIncomeTax(yearIncome)
      const yearSavings = yearIncome * savingsRate
      const vat = calculateVAT(yearIncome, vatRate, vatApplicableRate)

      let inheritance = 0
      let inheritanceTax = 0
      if (i === inheritanceAge) {
        inheritance = inheritanceAmount
        inheritanceTax = calculateInheritanceTax(inheritance, inheritanceTaxClass)
        // For inheritance year, add inheritance first, then apply growth
        totalWealth = (totalWealth + (inheritance - inheritanceTax)) * (1 + wealthGrowthRate)
      } else {
        // For normal years, apply growth to existing wealth and add contributions
        const yearContribution = yearSavings - yearlySpending
        totalWealth = (totalWealth * (1 + wealthGrowthRate)) + yearContribution
      }

      // Update totals
      totals.totalIncome += yearIncome
      totals.totalIncomeTax += incomeTax
      totals.totalVAT += vat
      totals.totalInheritance += inheritance
      totals.totalInheritanceTax += inheritanceTax
      totals.totalSpending += yearlySpending

      results.push({
        age: i,
        income: Math.round(yearIncome),
        incomeTax: Math.round(incomeTax),
        wealth: Math.round(totalWealth),
        wealthCreatedThisYear: Math.round(yearSavings),
        inheritance: Math.round(inheritance),
        inheritanceTax: Math.round(inheritanceTax),
        vat: Math.round(vat),
        spending: Math.round(yearlySpending),
      })
    }

    totals.totalWealth = Math.round(totalWealth)
    totals.totalIncome = Math.round(totals.totalIncome)
    totals.totalIncomeTax = Math.round(totals.totalIncomeTax)
    totals.totalVAT = Math.round(totals.totalVAT)
    totals.totalInheritance = Math.round(totals.totalInheritance)
    totals.totalInheritanceTax = Math.round(totals.totalInheritanceTax)
    totals.totalSpending = Math.round(totals.totalSpending)

    return { totals, details: results }
  }

  return { calculateLifeIncome }
}
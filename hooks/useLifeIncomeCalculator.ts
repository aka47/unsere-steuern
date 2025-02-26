import { INHERITANCE_TAX_CLASSES, TAX_BRACKETS } from "@/constants/tax"
import { type Persona } from "@/types/persona"
import { type LifeIncomeYearlyResult, type TaxScenario } from "@/types/life-income"
import { defaultTaxScenario } from "@/constants/tax-scenarios"

// This type has additional fields compared to LifeIncomeYearlyResult
export type LifeIncomeResult = LifeIncomeYearlyResult & {
  savings: number
  spendingFromIncome: number
}

type CalculateLifeIncomeParams = {
  currentIncome: number
  currentAge: number
  savingsRate: number
  inheritanceAge: number | undefined
  inheritanceAmount: number
  inheritanceTaxClass: 1 | 2 | 3
  vatRate: number
  vatApplicableRate: number
  yearlySpendingFromWealth: number
  currentWealth: number
  selectedPersona?: Persona
  initialAge?: number
  taxScenario?: TaxScenario
}

type LifeIncomeTotals = {
  totalWealth: number
  totalIncome: number
  totalIncomeTax: number
  totalWealthIncome: number
  totalWealthIncomeTax: number
  totalWealthTax: number
  totalVAT: number
  totalInheritance: number
  totalInheritanceTax: number
  totalSpending: number
  totalSavings: number
  totalSpendingFromWealth: number
  totalSpendingFromIncome: number
}

type LifeIncomeCalculatorResult = {
  totals: LifeIncomeTotals
  details: LifeIncomeYearlyResult[]
}

export function useLifeIncomeCalculator() {
  const calculateIncomeTax = (income: number) => {
    let tax = 0
    // let remainingIncome = income

    // for (const bracket of TAX_BRACKETS) {
    //   if (remainingIncome > bracket.limit) {
    //     const taxableAmount = Math.min(remainingIncome - bracket.limit, bracket.limit)
    //     tax += taxableAmount * bracket.rate
    //     remainingIncome -= taxableAmount
    //   } else {
    //     break
    //   }
    // }
    // };

    if (income <= 12096) {
      tax = 0; // a) Steuerfrei
    } else if (income <= 17443) {
      // b) (932,3 * y + 1.400) * y
      const y = (income - 12096) / 10000;
      tax = (932.3 * y + 1400) * y;
    } else if (income <= 68480) {
      // c) (176,64 * z + 2.397) * z + 1.015,13
      const z = (income - 17443) / 10000;
      tax = (176.64 * z + 2397) * z + 1015.13;
    } else if (income <= 277825) {
      // d) 0,42 * zvE - 10.911,92
      tax = 0.42 * income - 10911.92;
    } else {
      // e) 0,45 * zvE - 19.246,67
      tax = 0.45 * income - 19246.67;
    }

    return Math.max(0, tax); // Steuer darf nicht negativ sein


    // return tax
  }

  const calculateInheritanceTax = (amount: number, taxClass: keyof typeof INHERITANCE_TAX_CLASSES) => {
    let tax = 0
    let exemption = 400000 // freibetrag
    let taxableAmount = amount - exemption

    for (const bracket of INHERITANCE_TAX_CLASSES[taxClass]) {
      if (taxableAmount > bracket.limit) {
        continue
      }

      tax = Math.max(0, (taxableAmount) * bracket.rate)
      break
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
    yearlySpendingFromWealth,
    currentWealth,
    selectedPersona,
    initialAge = 20,
    taxScenario = defaultTaxScenario
  }: CalculateLifeIncomeParams): LifeIncomeCalculatorResult | null => {
    if (
      isNaN(currentIncome) ||
      isNaN(currentAge) ||
      currentAge < initialAge ||
      currentAge > 65 ||
      isNaN(savingsRate) ||
      savingsRate < 0 ||
      savingsRate > 1 ||
      isNaN(vatRate) ||
      isNaN(vatApplicableRate) ||
      isNaN(yearlySpendingFromWealth) ||
      isNaN(currentWealth) ||
      initialAge < 18 ||
      initialAge > 65
    ) {
      return null
    }

    const defaultGrowthRate = () => 1.02
    const growthRate = selectedPersona?.incomeGrowth || defaultGrowthRate
    const wealthGrowthRate = 0.05 // Base growth rate for wealth
    const wealthIncomeRate = 0.03 // Income generated from wealth (e.g., dividends, interest)
    const results: LifeIncomeResult[] = []
    let totalWealth = currentWealth || 0

    // Calculate initial income at initialAge by working backwards
    let initialIncome = currentIncome
    for (let age = currentAge; age > initialAge; age--) {
      const growthFactor = typeof growthRate === 'function' ? growthRate(age - 1) : defaultGrowthRate()
      initialIncome = initialIncome / growthFactor
    }

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
    }

    // Calculate from initial age (20) to retirement
    for (let i = initialAge; i <= 65; i++) {
      // Calculate work income
      const yearIncome = i === initialAge
        ? initialIncome
        : results[results.length - 1].income * (typeof growthRate === 'function' ? growthRate(i) : defaultGrowthRate())

      // Calculate wealth income (from investments)
      const wealthIncome = totalWealth * wealthIncomeRate

      // Calculate taxes using the provided tax scenario
      const incomeTax = taxScenario.calculateIncomeTax(yearIncome)
      const wealthIncomeTax = taxScenario.calculateWealthIncomeTax(wealthIncome)
      const wealthTax = taxScenario.calculateWealthTax(totalWealth)
      const vat = taxScenario.calculateVAT(yearIncome, vatRate, vatApplicableRate)

      // Calculate savings from income
      const yearSavings = yearIncome * savingsRate

      // Handle inheritance if applicable
      let inheritance = 0
      let inheritanceTax = 0
      if (i === inheritanceAge) {
        inheritance = inheritanceAmount
        inheritanceTax = taxScenario.calculateInheritanceTax(inheritance, inheritanceTaxClass)
        totalWealth += (inheritance - inheritanceTax)
      }

      // Update wealth
      // Add savings and wealth income (after tax), subtract spending and wealth tax
      const netWealthIncome = wealthIncome - wealthIncomeTax
      const yearContribution = yearSavings + netWealthIncome - yearlySpendingFromWealth - wealthTax

      // Apply wealth growth rate to existing wealth, then add this year's contribution
      totalWealth = (totalWealth * (1 + wealthGrowthRate)) + yearContribution

      // Calculate spending from income (after tax and savings)
      const yearSpendingFromIncome = yearIncome - incomeTax - yearSavings

      // Update totals
      totals.totalIncome += yearIncome
      totals.totalIncomeTax += incomeTax
      totals.totalWealthIncome += wealthIncome
      totals.totalWealthIncomeTax += wealthIncomeTax
      totals.totalWealthTax += wealthTax
      totals.totalVAT += vat
      totals.totalInheritance += inheritance
      totals.totalInheritanceTax += inheritanceTax
      totals.totalSpending += yearlySpendingFromWealth + yearSpendingFromIncome
      totals.totalSavings += yearSavings
      totals.totalSpendingFromWealth += yearlySpendingFromWealth
      totals.totalSpendingFromIncome += yearSpendingFromIncome

      // Add this year's results
      results.push({
        age: i,
        income: Math.round(yearIncome),
        incomeTax: Math.round(incomeTax),
        savings: Math.round(yearSavings),
        wealth: Math.round(totalWealth),
        wealthCreatedThisYear: Math.round(yearContribution),
        wealthIncome: Math.round(wealthIncome),
        wealthTax: Math.round(wealthTax),
        inheritance: Math.round(inheritance),
        inheritanceTax: Math.round(inheritanceTax),
        vat: Math.round(vat),
        spending: Math.round(yearlySpendingFromWealth + yearSpendingFromIncome),
        spendingFromIncome: Math.round(yearSpendingFromIncome)
      })
    }

    // Round totals
    totals.totalWealth = Math.round(totalWealth)
    totals.totalIncome = Math.round(totals.totalIncome)
    totals.totalIncomeTax = Math.round(totals.totalIncomeTax)
    totals.totalWealthIncome = Math.round(totals.totalWealthIncome)
    totals.totalWealthIncomeTax = Math.round(totals.totalWealthIncomeTax)
    totals.totalWealthTax = Math.round(totals.totalWealthTax)
    totals.totalVAT = Math.round(totals.totalVAT)
    totals.totalInheritance = Math.round(totals.totalInheritance)
    totals.totalInheritanceTax = Math.round(totals.totalInheritanceTax)
    totals.totalSpending = Math.round(totals.totalSpending)
    totals.totalSavings = Math.round(totals.totalSavings)
    totals.totalSpendingFromWealth = Math.round(totals.totalSpendingFromWealth)
    totals.totalSpendingFromIncome = Math.round(totals.totalSpendingFromIncome)

    return { totals, details: results }
  }

  return { calculateLifeIncome }
}
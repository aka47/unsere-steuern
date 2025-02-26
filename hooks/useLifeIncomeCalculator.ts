import { INHERITANCE_TAX_CLASSES, TAX_BRACKETS } from "@/constants/tax"
import { type Persona } from "@/types/persona"
import { type LifeIncomeYearlyResult } from "@/types/life-income"

// This type has additional fields compared to LifeIncomeYearlyResult
export type LifeIncomeResult = LifeIncomeYearlyResult & {
  savings: number
  spendingFromIncome: number
}

type CalculateLifeIncomeParams = Omit<Persona, 'id' | 'name' | 'description' | 'icon'> & {
  selectedPersona: Persona | null
  initialAge?: number
}

type LifeIncomeTotals = {
  totalWealth: number
  totalIncome: number
  totalIncomeTax: number
  totalVAT: number
  totalInheritance: number
  totalInheritanceTax: number
  totalSpending: number
  totalSavings: number
  totalSpendingFromWealth: number,
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
    selectedPersona,
    initialAge = 20,
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
      initialAge < 18 ||
      initialAge > 65
    ) {
      return null
    }

    const defaultGrowthRate = () => 1.02
    const growthRate = selectedPersona?.incomeGrowth || defaultGrowthRate
    const wealthGrowthRate = 0.05
    const results: LifeIncomeResult[] = []
    let totalWealth = 0

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
      const yearIncome = i === initialAge
        ? initialIncome
        : results[results.length - 1].income * (typeof growthRate === 'function' ? growthRate(i) : defaultGrowthRate())
      const incomeTax = calculateIncomeTax(yearIncome)
      const yearSavings = yearIncome * savingsRate
      const vat = calculateVAT(yearIncome, vatRate, vatApplicableRate)

      let inheritance = 0
      let inheritanceTax = 0
      if (i === inheritanceAge) {
        inheritance = inheritanceAmount
        inheritanceTax = calculateInheritanceTax(inheritance, inheritanceTaxClass)
        totalWealth += (inheritance - inheritanceTax)
      }

      const yearContribution = yearSavings - yearlySpendingFromWealth
      totalWealth = (totalWealth * (1 + wealthGrowthRate)) + yearContribution
      const yearSpendingFromIncome = yearIncome - incomeTax - yearSavings

      // Update totals
      totals.totalIncome += yearIncome
      totals.totalIncomeTax += incomeTax
      totals.totalVAT += vat
      totals.totalInheritance += inheritance
      totals.totalInheritanceTax += inheritanceTax
      totals.totalSpending += yearlySpendingFromWealth + yearSpendingFromIncome

      totals.totalSavings += yearSavings
      totals.totalSpendingFromWealth += yearlySpendingFromWealth
      totals.totalSpendingFromIncome += yearContribution

      results.push({
        age: i,
        income: Math.round(yearIncome),
        incomeTax: Math.round(incomeTax),
        savings: Math.round(yearSavings),
        wealth: Math.round(totalWealth),
        wealthCreatedThisYear: Math.round(yearSavings),
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
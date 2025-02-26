import { INHERITANCE_TAX_CLASSES } from "./tax"
import { type TaxScenario } from "@/types/life-income"

// Status Quo (current tax system)
export const statusQuoScenario: TaxScenario = {
  id: "status-quo",
  name: "Status Quo",
  description: "Das aktuelle Steuersystem in Deutschland",

  calculateIncomeTax: (income: number) => {
    let tax = 0

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
  },

  calculateInheritanceTax: (amount: number, taxClass: 1 | 2 | 3) => {
    let tax = 0
    let exemption = 400000 // freibetrag
    let taxableAmount = amount - exemption

    if (taxableAmount <= 0) return 0

    for (const bracket of INHERITANCE_TAX_CLASSES[taxClass]) {
      if (taxableAmount > bracket.limit) {
        continue
      }

      tax = Math.max(0, taxableAmount * bracket.rate)
      break
    }

    return tax
  },

  calculateWealthTax: (wealth: number) => {
    // Currently no wealth tax in Germany
    return 0
  },

  calculateWealthIncomeTax: (wealthIncome: number) => {
    // Flat tax rate of 25% (Abgeltungssteuer) + 5.5% solidarity surcharge
    return wealthIncome * 0.26375
  },

  calculateVAT: (income: number, vatRate: number, vatApplicableRate: number) => {
    const grossSpending = income * (vatApplicableRate / 100)
    return grossSpending * (vatRate / (100 + vatRate))
  }
}

// Progressive Wealth Tax Scenario
export const progressiveWealthTaxScenario: TaxScenario = {
  id: "progressive-wealth-tax",
  name: "Progressive Vermögenssteuer",
  description: "Ein progressives Steuersystem mit Vermögenssteuer",

  calculateIncomeTax: statusQuoScenario.calculateIncomeTax,

  calculateInheritanceTax: statusQuoScenario.calculateInheritanceTax,

  calculateWealthTax: (wealth: number) => {
    // Progressive wealth tax with exemption
    const exemption = 1000000 // 1 million exemption
    const taxableWealth = Math.max(0, wealth - exemption)

    if (taxableWealth <= 0) return 0

    if (taxableWealth <= 10000000) { // Up to 10 million
      return taxableWealth * 0.01 // 1%
    } else if (taxableWealth <= 100000000) { // Up to 100 million
      return 10000000 * 0.01 + (taxableWealth - 10000000) * 0.015 // 1.5% on amount over 10 million
    } else { // Over 100 million
      return 10000000 * 0.01 + 90000000 * 0.015 + (taxableWealth - 100000000) * 0.02 // 2% on amount over 100 million
    }
  },

  calculateWealthIncomeTax: (wealthIncome: number) => {
    // Treat capital gains as regular income
    return statusQuoScenario.calculateIncomeTax(wealthIncome)
  },

  calculateVAT: statusQuoScenario.calculateVAT
}

// Flat Tax Scenario
export const flatTaxScenario: TaxScenario = {
  id: "flat-tax",
  name: "Flat Tax",
  description: "Ein Flat-Tax-System mit einheitlichem Steuersatz",

  calculateIncomeTax: (income: number) => {
    const exemption = 12000 // Basic exemption
    const taxableIncome = Math.max(0, income - exemption)
    return taxableIncome * 0.25 // 25% flat rate
  },

  calculateInheritanceTax: (amount: number, taxClass: 1 | 2 | 3) => {
    const exemption = 500000 // Higher exemption
    const taxableAmount = Math.max(0, amount - exemption)
    return taxableAmount * 0.20 // 20% flat rate
  },

  calculateWealthTax: (wealth: number) => {
    // No wealth tax in flat tax scenario
    return 0
  },

  calculateWealthIncomeTax: (wealthIncome: number) => {
    // Same flat rate as income
    return wealthIncome * 0.25
  },

  calculateVAT: (income: number, vatRate: number, vatApplicableRate: number) => {
    // Simplified VAT calculation with flat 15% rate
    const grossSpending = income * (vatApplicableRate / 100)
    return grossSpending * (15 / 115)
  }
}

// All available tax scenarios
export const taxScenarios: TaxScenario[] = [
  statusQuoScenario,
  progressiveWealthTaxScenario,
  flatTaxScenario
]

// Default scenario
export const defaultTaxScenario = statusQuoScenario
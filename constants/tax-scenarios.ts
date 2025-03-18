// import { INHERITANCE_TAX_CLASSES } from "@/constants/tax"
import { INHERITANCE_TAX_CLASSES } from "./tax"

import { type TaxScenario } from "@/types/life-income"
import {
  statusQuoDescription,
  progressiveWealthTaxDescription,
  flatTaxDescription,
  fiftysTaxDescription
} from "./tax-scenario-descriptions"

type TaxClass = 1 | 2 | 3

// Status Quo (current tax system)
export const statusQuoScenario: TaxScenario = {
  id: "status-quo",
  name: "Status Quo",
  description: "Das aktuelle Steuersystem in Deutschland",
  detailedDescription: statusQuoDescription,

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

  calculateInheritanceTax(inheritanceTaxableHousingFinancial: number, inheritanceTaxableCompany: number, inheritanceHardship: boolean, taxClass: TaxClass): number {
    const hardshipExemptionThreshold = 1900000; // >1.9M euros qualifies
    const hardshipExemptionRate = 0.6;
    let taxableAmount = inheritanceTaxableHousingFinancial + inheritanceTaxableCompany;
    if (inheritanceHardship && taxableAmount > hardshipExemptionThreshold) {
      taxableAmount *= (1 - hardshipExemptionRate); // 60% exempt
    }
    let tax = 0;
    let previousLimit = 0;

    if (taxClass === undefined) taxClass = 1

    for (const bracket of INHERITANCE_TAX_CLASSES[taxClass]) {
      if (taxableAmount <= previousLimit) break;

      const taxableInBracket = Math.min(taxableAmount, bracket.limit) - previousLimit;
      if (taxableInBracket > 0) {
        tax += taxableInBracket * bracket.rate;
      }
      previousLimit = bracket.limit;
    }

    return tax;
  },

  calculateWealthTax: (wealth: number) => {
    // Currently no wealth tax in Germany
    return 0
  },

  calculateWealthIncomeTax: (wealthIncome: number) => {
    // Flat tax rate of 25% (Abgeltungssteuer) + 5,5% solidarity surcharge
    const wealthIncomeTaxedRate = 0.1
    return wealthIncome * wealthIncomeTaxedRate * 0.26375
  },

  calculateVAT: (income: number, vatRate: number, vatApplicableRate: number) => {
    const grossSpending = income * (vatApplicableRate / 100)
    return grossSpending * (vatRate / (100 + vatRate))
  }
}

// Progressive Wealth Tax Scenario
export const progressiveWealthTaxScenario: TaxScenario = {
  id: "progressive-wealth-tax",
  name: "Progressive Einheitssteuer",
  description: "Ein progressives Einheitssteuer. Alle Einkommen aus Arbeit, Kaptial und Erbschaften werden progressiv besteuert, bestehende Freibeträge bleiben bestehen.",
  detailedDescription: progressiveWealthTaxDescription,

  calculateIncomeTax: (income: number) => {
    let tax = 0

    if (income <= 12096) {
      tax = 0; // a) Steuerfrei
    } else if (income <= 17443) {
      const y = (income - 12096) / 10000;
      tax = (559.38 * y + 840) * y; // b) 40% reduction
    } else if (income <= 68480) {
      const z = (income - 17443) / 10000;
      tax = (114.82 * z + 1558.05) * z + 659.83; // c) 35% reduction
    } else if (income <= 277825) {
      tax = 0.294 * income - 7638.34; // d) 30% reduction
    } else {
      tax = 0.3375 * income - 14435; // e) 25% reduction
    }

    return Math.max(0, tax); // Steuer darf nicht negativ sein
  },
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
  detailedDescription: flatTaxDescription,

  calculateIncomeTax: (income: number) => {
    const exemption = 0 // Basic exemption
    const taxableIncome = Math.max(0, income - exemption)
    return taxableIncome * 0.1034 //
  },

  calculateInheritanceTax: (inheritanceTaxableHousingFinancial: number, inheritanceTaxableCompany: number, inheritanceHardship: boolean, taxClass: TaxClass) => {
    const exemption = 0 // no exemption
    const taxableAmount = Math.max(0, inheritanceTaxableHousingFinancial + inheritanceTaxableCompany - exemption)
    return taxableAmount * 0.1034 // 20% flat rate
  },

  calculateWealthTax: (wealth: number) => {
    // No wealth tax in flat tax scenario
    return 0
  },

  calculateWealthIncomeTax: (wealthIncome: number) => {
    // Same flat rate as income
    return wealthIncome * 0.1034
  },

  calculateVAT: (income: number, vatRate: number, vatApplicableRate: number) => {
    // Simplified VAT calculation with flat 15% rate
    const grossSpending = income * (vatApplicableRate / 100)
    return grossSpending * (15 / 115)
  }
}

// 1950s-60s Tax Scenario (Wirtschaftswunder era)
export const fiftysTaxScenario: TaxScenario = {
  id: "fiftys-tax",
  name: "Wirtschaftswunder",
  description: "Das Steuersystem der 50er und 60er Jahre, als Deutschland sein Wirtschaftswunder erlebte",
  detailedDescription: fiftysTaxDescription,

  calculateIncomeTax: (income: number) => {
    // Higher progressive rates in the 1950s-60s
    // Top marginal rate was around 53% in this era
    let tax = 0

    if (income <= 8000) {
      tax = 0; // Basic exemption (adjusted for the era)
    } else if (income <= 16000) {
      tax = (income - 8000) * 0.20; // 20% on first bracket
    } else if (income <= 32000) {
      tax = 1600 + (income - 16000) * 0.30; // 30% on second bracket
    } else if (income <= 64000) {
      tax = 6400 + (income - 32000) * 0.40; // 40% on third bracket
    } else if (income <= 120000) {
      tax = 19200 + (income - 64000) * 0.48; // 48% on fourth bracket
    } else {
      tax = 46080 + (income - 120000) * 0.53; // 53% on highest bracket
    }

    return Math.max(0, tax);
  },

  calculateInheritanceTax: (inheritanceTaxableHousingFinancial: number, inheritanceTaxableCompany: number, inheritanceHardship: boolean, taxClass: TaxClass) => {
    // Inheritance tax was generally higher in the 1950s-60s
    let exemption = 200000; // Lower exemption than today
    let taxableAmount = Math.max(0, inheritanceTaxableHousingFinancial + inheritanceTaxableCompany - exemption);

    if (taxableAmount <= 0) return 0;

    // Higher rates based on tax class
    const rates = {
      1: 0.15, // 15% for close family
      2: 0.25, // 25% for extended family
      3: 0.40  // 40% for non-family
    };

    return taxableAmount * rates[taxClass];
  },

  calculateWealthTax: (wealth: number) => {
    // Wealth tax existed in the 1950s-60s
    const exemption = 200000; // Lower exemption
    const taxableWealth = Math.max(0, wealth - exemption);

    if (taxableWealth <= 0) return 0;

    return taxableWealth * 0.01; // 1% wealth tax
  },

  calculateWealthIncomeTax: (wealthIncome: number) => {
    // Capital gains were taxed as regular income
    return fiftysTaxScenario.calculateIncomeTax(wealthIncome);
  },

  calculateVAT: (income: number, vatRate: number, vatApplicableRate: number) => {
    // VAT was lower in the 1950s-60s (around 4% initially)
    const grossSpending = income * (vatApplicableRate / 100);
    return grossSpending * (4 / 104); // 4% VAT rate
  }
};

// Custom Tax Scenario
export const customTaxScenario: TaxScenario = {
  id: "custom",
  name: "Deine Steuer",
  description: "Gestalte dein eigenes Steuersystem",
  detailedDescription: "Passe die Steuerparameter an, um dein eigenes Steuersystem zu erstellen.",

  calculateIncomeTax: (income: number) => {
    // This will be calculated dynamically based on user input
    return 0
  },

  calculateInheritanceTax: (inheritanceTaxableHousingFinancial: number, inheritanceTaxableCompany: number, inheritanceHardship: boolean, taxClass: TaxClass) => {
    // This will be calculated dynamically based on user input
    return 0
  },

  calculateWealthTax: (wealth: number) => {
    // This will be calculated dynamically based on user input
    return 0
  },

  calculateWealthIncomeTax: (wealthIncome: number) => {
    // This will be calculated dynamically based on user input
    return 0
  },

  calculateVAT: (income: number, vatRate: number, vatApplicableRate: number) => {
    // This will be calculated dynamically based on user input
    return 0
  }
}

// All available tax scenarios
export const taxScenarios: TaxScenario[] = [
  statusQuoScenario,
  progressiveWealthTaxScenario,
  flatTaxScenario,
  fiftysTaxScenario,
  customTaxScenario
]

// Default scenario
export const defaultTaxScenario = statusQuoScenario
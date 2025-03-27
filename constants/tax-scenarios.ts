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

// Define the income tax reduction levels and their coefficients
type IncomeTaxLevel = {
  name: string
  description: string
  // Coefficients for each bracket
  bracket1: { // 12096 - 17443
    a: number  // replaces 559.38
    b: number  // replaces 840
  }
  bracket2: { // 17443 - 68480
    a: number  // replaces 114.82
    b: number  // replaces 1558.05
    c: number  // replaces 659.83
  }
  bracket3: { // 68480 - 277825
    rate: number    // replaces 0.294
    subtract: number // replaces 7638.34
  }
  bracket4: { // > 277825
    rate: number    // replaces 0.3375
    subtract: number // replaces 14435
  }
}

// Define the tax reduction levels
export const incomeTaxLevels: Record<string, IncomeTaxLevel> = {
  "status-quo": {
    name: "Status Quo",
    description: "Aktuelles Steuersystem in Deutschland",
    bracket1: { a: 932.3, b: 1400 },
    bracket2: { a: 176.64, b: 2397, c: 1015.13 },
    bracket3: { rate: 0.42, subtract: 10911.92 },
    bracket4: { rate: 0.45, subtract: 19246.67 }
  },
  "reduction-40": {
    name: "40% weniger",
    description: "40% niedrigere Einkommensteuer als Status Quo",
    bracket1: { a: 559.38, b: 840 },
    bracket2: { a: 114.82, b: 1558.05, c: 659.83 },
    bracket3: { rate: 0.294, subtract: 7638.34 },
    bracket4: { rate: 0.3375, subtract: 14435 }
  },
  "reduction-55": {
    name: "55% weniger",
    description: "55% niedrigere Einkommensteuer als Status Quo",
    bracket1: { a: 419.535, b: 630 }, // 0.45 * original values
    bracket2: { a: 79.488, b: 1078.65, c: 456.8085 }, // 0.45 * original values
    bracket3: { rate: 0.189, subtract: 4910.364 }, // 0.45 * original values
    bracket4: { rate: 0.2025, subtract: 8661.0015 } // 0.45 * original values
  },
  "reduction-65": {
    name: "65% weniger",
    description: "65% niedrigere Einkommensteuer als Status Quo",
    bracket1: { a: 326.305, b: 490 }, // 0.35 * original values
    bracket2: { a: 61.824, b: 838.95, c: 355.4405 }, // 0.35 * original values
    bracket3: { rate: 0.147, subtract: 3819.172 }, // 0.35 * original values
    bracket4: { rate: 0.1575, subtract: 6736.3345 } // 0.35 * original values
  },
  "reduction-80": {
    name: "80% weniger",
    description: "80% niedrigere Einkommensteuer als Status Quo",
    bracket1: { a: 186.46, b: 280 }, // 0.20 * original values
    bracket2: { a: 35.328, b: 479.4, c: 203.026 }, // 0.20 * original values
    bracket3: { rate: 0.084, subtract: 2182.384 }, // 0.20 * original values
    bracket4: { rate: 0.09, subtract: 3849.334 } // 0.20 * original values
  }
}

// Define the wealth tax levels and their coefficients
type WealthTaxLevel = {
  name: string
  description: string
  exemption: number
  brackets: {
    limit: number
    rate: number
  }[]
}

// Define the wealth tax levels
export const wealthTaxLevels: Record<string, WealthTaxLevel> = {
  "status-quo": {
    name: "Status Quo",
    description: "Aktuelles Steuersystem in Deutschland",
    exemption: 0,
    brackets: []
  },
  "wealth-tax-high": {
    name: "Hohe Vermögensteuer",
    description: "Progressive Vermögensteuer mit 1-2% Steuersatz",
    exemption: 1000000,
    brackets: [
      { limit: 10000000, rate: 0.01 },    // 1% up to 10M
      { limit: 100000000, rate: 0.015 },  // 1.5% up to 100M
      { limit: Infinity, rate: 0.02 }      // 2% above 100M
    ]
  },
  "wealth-tax-medium": {
    name: "Mittlere Vermögensteuer",
    description: "Progressive Vermögensteuer mit 0.5-1% Steuersatz",
    exemption: 1000000,
    brackets: [
      { limit: 10000000, rate: 0.005 },   // 0.5% up to 10M
      { limit: 100000000, rate: 0.0075 }, // 0.75% up to 100M
      { limit: Infinity, rate: 0.01 }      // 1% above 100M
    ]
  },
  "wealth-tax-low": {
    name: "Niedrige Vermögensteuer",
    description: "Progressive Vermögensteuer mit 0.25-0.5% Steuersatz",
    exemption: 1000000,
    brackets: [
      { limit: 10000000, rate: 0.0025 },  // 0.25% up to 10M
      { limit: 100000000, rate: 0.00375 }, // 0.375% up to 100M
      { limit: Infinity, rate: 0.005 }      // 0.5% above 100M
    ]
  }
}

// Define the VAT levels and their coefficients
type VATLevel = {
  name: string
  description: string
  rate: number
}

// Define the VAT levels
export const vatLevels: Record<string, VATLevel> = {
  "status-quo": {
    name: "Status Quo",
    description: "Aktuelles Steuersystem in Deutschland",
    rate: 19
  },
  "vat-medium": {
    name: "Mittlere Mehrwertsteuer",
    description: "Reduzierte Mehrwertsteuer von 15%",
    rate: 15
  },
  "vat-adenauer": {
    name: "Adenauer-Ära",
    description: "Mehrwertsteuer der 50er Jahre",
    rate: 4
  },
  "vat-zero": {
    name: "Keine Mehrwertsteuer",
    description: "System ohne Mehrwertsteuer",
    rate: 0
  }
}

// Status Quo (current tax system)
export const statusQuoScenario: TaxScenario = {
  id: "status-quo",
  name: "Status Quo",
  description: "Das aktuelle Steuersystem in Deutschland",
  detailedDescription: statusQuoDescription,
  taxSummary: {
    totalTax: "Summe aller Steuern heute (Einkommen, Erbschaft, Kapitalerträge, Mehrwertsteuer)",
    incomeTax: "Progressiver Steuersatz: 0% bis 45% (Grundfreibetrag: 12.096€)",
    inheritanceTax: "Progressive Erbschaftsteuer mit Freibeträgen und Härtefallregelung (60% Befreiung ab 1,9M€)",
    wealthTax: "Keine Vermögensteuer",
    wealthIncomeTax: "25% Abgeltungssteuer + 5,5% Solidaritätszuschlag",
    vatTax: "Standardmäßig 19% (ermäßigt 7%)"
  },

  calculateIncomeTax: (income: number) => {
    return calculateIncomeTaxFromBrackets(income, "status-quo")
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
    return calculateWealthIncomeTaxFromBrackets(wealthIncome, "status-quo")
  },

  calculateVAT: (income: number, vatRate: number, vatApplicableRate: number) => {
    return calculateVATFromBrackets(income, vatRate, vatApplicableRate, "status-quo")
  }
}

// Progressive Wealth Tax Scenario
export const progressiveWealthTaxScenario: TaxScenario = {
  id: "progressive-wealth-tax",
  name: "Progressive Einheitssteuer",
  description: "Ein progressives Einheitssteuer. Alle Einkommen aus Arbeit, Kaptial und Erbschaften werden progressiv besteuert, bestehende Freibeträge bleiben bestehen.",
  detailedDescription: progressiveWealthTaxDescription,
  taxSummary: {
    totalTax: "Alle Einkommen werden progressiv besteuert, bestehende Freibeträge bleiben bestehen.",
    incomeTax: "Reduzierte progressive Einkommensteuer (30-40% niedriger als Status Quo)",
    inheritanceTax: "Gleich wie Status Quo",
    wealthTax: "Progressive Vermögensteuer: 1% bis 2% (Freibetrag: 1M€)",
    wealthIncomeTax: "Wird wie normales Einkommen besteuert",
    vatTax: "Gleich wie Status Quo"
  },

  calculateIncomeTax: (income: number) => {
    return calculateIncomeTaxFromBrackets(income, "reduction-80")
  },

  calculateInheritanceTax: statusQuoScenario.calculateInheritanceTax,

  calculateWealthTax: (wealth: number) => {
    return calculateWealthTaxFromBrackets(wealth, "wealth-tax-low")
  },

  calculateWealthIncomeTax: (wealthIncome: number) => {
    // Treat capital gains as regular income
    return progressiveWealthTaxScenario.calculateIncomeTax(wealthIncome)
  },

  calculateVAT: (income: number, vatRate: number, vatApplicableRate: number) => {
    return calculateVATFromBrackets(income, vatRate, vatApplicableRate, "vat-medium")
  }
}

// Flat Tax Scenario
export const flatTaxScenario: TaxScenario = {
  id: "flat-tax",
  name: "Flat Tax",
  description: "Ein Flat-Tax-System mit einheitlichem Steuersatz",
  detailedDescription: flatTaxDescription,
  taxSummary: {
    totalTax: "Vereinfachtes Steuersystem mit einheitlichem Steuersatz von 10,34%",
    incomeTax: "Einheitlicher Steuersatz von 10,34%",
    inheritanceTax: "Einheitlicher Steuersatz von 10,34%",
    wealthTax: "Keine Vermögensteuer",
    wealthIncomeTax: "Einheitlicher Steuersatz von 10,34%",
    vatTax: "Vereinfachte Mehrwertsteuer von 15%"
  },

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
  taxSummary: {
    totalTax: "Höhere Einkommensteuer und Vermögensteuer",
    incomeTax: "Höhere progressive Sätze (20% bis 53%)",
    inheritanceTax: "Höhere Erbschaftsteuer (15-40%) mit niedrigerem Freibetrag (200.000€)",
    wealthTax: "1% Vermögensteuer (Freibetrag: 200.000€)",
    wealthIncomeTax: "Wird wie normales Einkommen besteuert",
    vatTax: "Niedrigere Mehrwertsteuer von 4%"
  },

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
    // return calculateWealthIncomeTaxFromBrackets(wealthIncome, "lower")

    return fiftysTaxScenario.calculateIncomeTax(wealthIncome);
  },

  calculateVAT: (income: number, vatRate: number, vatApplicableRate: number) => {
    return calculateVATFromBrackets(income, vatRate, vatApplicableRate, "vat-adenauer")
  }
};

// Custom Tax Scenario
export const customTaxScenario: TaxScenario = {
  id: "custom",
  name: "Deine Steuer",
  description: "Gestalte dein eigenes Steuersystem",
  detailedDescription: "Passe die Steuerparameter an, um dein eigenes Steuersystem zu erstellen.",
  taxSummary: {
    totalTax: "Wird dynamisch basierend auf Benutzereingaben berechnet",
    incomeTax: "Wird dynamisch basierend auf Benutzereingaben berechnet",
    inheritanceTax: "Wird dynamisch basierend auf Benutzereingaben berechnet",
    wealthTax: "Wird dynamisch basierend auf Benutzereingaben berechnet",
    wealthIncomeTax: "Wird dynamisch basierend auf Benutzereingaben berechnet",
    vatTax: "Wird dynamisch basierend auf Benutzereingaben berechnet"
  },

  calculateIncomeTax: (income: number) => {
    return calculateIncomeTaxFromBrackets(income, "status-quo")
  },

  calculateInheritanceTax: (inheritanceTaxableHousingFinancial: number, inheritanceTaxableCompany: number, inheritanceHardship: boolean, taxClass: TaxClass) => {
    return statusQuoScenario.calculateInheritanceTax(inheritanceTaxableHousingFinancial, inheritanceTaxableCompany, inheritanceHardship, taxClass)
  },

  calculateWealthTax: (wealth: number) => {
    return calculateWealthTaxFromBrackets(wealth, "status-quo")
  },

  calculateWealthIncomeTax: (wealthIncome: number) => {
    return calculateIncomeTaxFromBrackets(wealthIncome, "status-quo")
  },

  calculateVAT: (income: number, vatRate: number, vatApplicableRate: number) => {
    return calculateVATFromBrackets(income, vatRate, vatApplicableRate, "status-quo")
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

// Update the calculateIncomeTax function to use these levels
export function calculateIncomeTaxFromBrackets(income: number, range: keyof typeof incomeTaxLevels = "status-quo") {
  const levels = incomeTaxLevels[range]
  let tax = 0

  if (income <= 12096) {
    tax = 0; // a) Steuerfrei
  } else if (income <= 17443) {
    const y = (income - 12096) / 10000;
    tax = (levels.bracket1.a * y + levels.bracket1.b) * y;
  } else if (income <= 68480) {
    const z = (income - 17443) / 10000;
    tax = (levels.bracket2.a * z + levels.bracket2.b) * z + levels.bracket2.c;
  } else if (income <= 277825) {
    tax = levels.bracket3.rate * income - levels.bracket3.subtract;
  } else {
    tax = levels.bracket4.rate * income - levels.bracket4.subtract;
  }

  return Math.max(0, tax);
}

// Update the calculateWealthTax function to use these levels
export function calculateWealthTaxFromBrackets(wealth: number, range: keyof typeof wealthTaxLevels = "status-quo") {
  const levels = wealthTaxLevels[range]
  const taxableWealth = Math.max(0, wealth - levels.exemption)

  if (taxableWealth <= 0) return 0

  let tax = 0
  let previousLimit = 0

  for (const bracket of levels.brackets) {
    if (taxableWealth <= previousLimit) break

    const taxableInBracket = Math.min(taxableWealth, bracket.limit) - previousLimit
    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate
    }
    previousLimit = bracket.limit
  }

  return tax
}

// Update the calculateVAT function to use these levels
export function calculateVATFromBrackets(income: number, vatRate: number, vatApplicableRate: number, range: keyof typeof vatLevels = "status-quo") {
  const level = vatLevels[range]
  const grossSpending = income * (vatApplicableRate / 100)
  return grossSpending * (level.rate / (100 + level.rate))
}

export const wealthIncomeTaxLevels = {
  "status-quo": {
    name: "Status Quo",
    description: "25% Abgeltungssteuer + 5,5% Solidaritätszuschlag auf 10% bzw. 5% des Kapital-Einkommens",
    brackets: [
      { threshold: 0, rate: 0.25, taxablePortion: 0.10, solidaritySurcharge: 0.055 }, // 25% on 20% of income + 5.5% solidarity
      { threshold: 100000, rate: 0.25, taxablePortion: 0.05, solidaritySurcharge: 0.055 }
    ]
  },
  "lower": {
    name: "Niedriger",
    description: "15% Abgeltungssteuer + 5,5% Solidaritätszuschlag auf 15% des Einkommens",
    brackets: [
      { threshold: 0, rate: 0.15, taxablePortion: 0.15, solidaritySurcharge: 0.055 }, // 15% on 15% of income + 5.5% solidarity
      { threshold: 100000, rate: 0.15, taxablePortion: 0.15, solidaritySurcharge: 0.055 }
    ]
  },
  "higher": {
    name: "Höher",
    description: "35% Abgeltungssteuer + 5,5% Solidaritätszuschlag auf 25% des Einkommens",
    brackets: [
      { threshold: 0, rate: 0.35, taxablePortion: 0.25, solidaritySurcharge: 0.055 }, // 35% on 25% of income + 5.5% solidarity
      { threshold: 100000, rate: 0.35, taxablePortion: 0.25, solidaritySurcharge: 0.055 }
    ]
  },
  "highest": {
    name: "Sehr hoch",
    description: "45% Abgeltungssteuer + 5,5% Solidaritätszuschlag auf 30% des Einkommens",
    brackets: [
      { threshold: 0, rate: 0.45, taxablePortion: 0.30, solidaritySurcharge: 0.055 }, // 45% on 30% of income + 5.5% solidarity
      { threshold: 100000, rate: 0.45, taxablePortion: 0.30, solidaritySurcharge: 0.055 }
    ]
  }
} as const

export function calculateWealthIncomeTaxFromBrackets(income: number, range: keyof typeof wealthIncomeTaxLevels = "status-quo") {
  const brackets = wealthIncomeTaxLevels[range].brackets
  let tax = 0

  // Find the applicable bracket
  const applicableBracket = brackets.reduce((prev, curr) => {
    return income >= curr.threshold ? curr : prev
  }, brackets[0])

  // Calculate taxable portion of income
  const taxableIncome = income * applicableBracket.taxablePortion

  // Calculate tax including solidarity surcharge
  tax = taxableIncome * applicableBracket.rate * (1 + applicableBracket.solidaritySurcharge)

  return tax
}


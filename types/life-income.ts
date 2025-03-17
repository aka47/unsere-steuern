import { InheritanceTaxClass } from "@/types/inheritance-tax"

export type LifeIncomeYearlyResult = {
  age: number
  income: number
  incomeTax: number
  wealth: number
  wealthGrowth: number
  wealthIncome: number
  wealthTax: number
  inheritance: number
  inheritanceTax: number
  vat: number
  spending: number
  tax: number
  taxRate: number
}

export type LifeIncomeResults = LifeIncomeYearlyResult[] | null

export type TaxScenario = {
  id: string
  name: string
  description: string
  detailedDescription?: string  // Detailed explanation of tax rates and rules
  // Tax calculation functions
  calculateIncomeTax: (income: number) => number
  calculateInheritanceTax: (inheritanceTaxableHousingFinancial: number, inheritanceTaxableCompany: number, inheritanceHardship: boolean, taxClass: InheritanceTaxClass) => number
  calculateWealthTax: (wealth: number) => number
  calculateWealthIncomeTax: (wealthIncome: number) => number
  calculateVAT: (income: number, vatRate: number, vatApplicableRate: number) => number
}

export interface TaxDistribution {
  incomeTax: number;
  vat: number;
  wealthTax: number;
  wealthIncomeTax: number;
  total: number;
}
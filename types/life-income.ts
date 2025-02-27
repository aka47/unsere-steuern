export type LifeIncomeYearlyResult = {
  age: number
  income: number
  incomeTax: number
  wealth: number
  wealthCreatedThisYear: number
  wealthIncome: number
  wealthTax: number
  inheritance: number
  inheritanceTax: number
  vat: number
  spending: number
}

export type LifeIncomeResults = LifeIncomeYearlyResult[] | null

export type TaxScenario = {
  id: string
  name: string
  description: string
  detailedDescription?: string  // Detailed explanation of tax rates and rules
  // Tax calculation functions
  calculateIncomeTax: (income: number) => number
  calculateInheritanceTax: (amount: number, taxClass: 1 | 2 | 3) => number
  calculateWealthTax: (wealth: number) => number
  calculateWealthIncomeTax: (wealthIncome: number) => number
  calculateVAT: (income: number, vatRate: number, vatApplicableRate: number) => number
}
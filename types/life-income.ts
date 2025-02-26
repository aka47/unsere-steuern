export type LifeIncomeYearlyResult = {
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

export type LifeIncomeResults = LifeIncomeYearlyResult[] | null
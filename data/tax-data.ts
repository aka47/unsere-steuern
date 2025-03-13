export const INCOME_TAX_BRACKETS = [
  { limit: 11604, rate: 0 },
  { limit: 17005, rate: 0.14 },
  { limit: 66761, rate: 0.24 },
  { limit: 277826, rate: 0.42 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.45 },
]

export const INCOME_TAX_DATA = {
  totalRevenue: 232000000000, // 232 billion
  totalGrossIncome: 1100000000000, // 1100 billion
}

export const INHERITANCE_TAX_CLASSES = {
  1: {
    description: "Steuerklasse I (Ehepartner, Kinder, Enkel, Eltern)",
    brackets: [
      { limit: 75000, rate: 0.07 },
      { limit: 300000, rate: 0.11 },
      { limit: 600000, rate: 0.15 },
      { limit: 6000000, rate: 0.19 },
      { limit: 13000000, rate: 0.23 },
      { limit: 26000000, rate: 0.27 },
      { limit: Number.POSITIVE_INFINITY, rate: 0.3 },
    ],
  },
  2: {
    description: "Steuerklasse II (Geschwister, Nichten, Neffen, Stiefkinder, Schwiegereltern, geschiedene Ehepartner)",
    brackets: [
      { limit: 75000, rate: 0.15 },
      { limit: 300000, rate: 0.2 },
      { limit: 600000, rate: 0.25 },
      { limit: 6000000, rate: 0.3 },
      { limit: 13000000, rate: 0.35 },
      { limit: 26000000, rate: 0.4 },
      { limit: Number.POSITIVE_INFINITY, rate: 0.43 },
    ],
  },
  3: {
    description: "Steuerklasse III (Nicht verwandte Personen, Geschäftspartner, entfernte Verwandte, Freunde)",
    brackets: [
      { limit: 75000, rate: 0.3 },
      { limit: 300000, rate: 0.3 },
      { limit: 600000, rate: 0.3 },
      { limit: 6000000, rate: 0.3 },
      { limit: 13000000, rate: 0.5 },
      { limit: 26000000, rate: 0.5 },
      { limit: Number.POSITIVE_INFINITY, rate: 0.5 },
    ],
  },
}

export const INHERITANCE_TAX_DATA = {
  totalInheritance: 400000000000, // 400 billion
  inheritanceTaxable: 100000000000, // 100 billion
  taxRevenue: 11000000000, // 11 billion
}

// Mock data for income tax over years
export const INCOME_TAX_YEARLY = [
  { year: 2015, revenue: 220000000000 },
  { year: 2016, revenue: 223000000000 },
  { year: 2017, revenue: 226000000000 },
  { year: 2018, revenue: 228000000000 },
  { year: 2019, revenue: 230000000000 },
  { year: 2020, revenue: 226000000000 }, // Slight decrease due to pandemic
  { year: 2021, revenue: 228000000000 },
  { year: 2022, revenue: 232000000000 },
]

export const WEALTH_DATA = {
  totalWealth: 20000000000000, // 20 trillion euros
  totalWealthInherited: 14000000000000, // 14 trillion euros (70%)
  totalWealthSelfCreated: 6000000000000, // 6 trillion euros (30%)
}


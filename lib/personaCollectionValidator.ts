import { PersonaCollection } from "@/types/personaCollection"

export interface PersonaCollectionTotals {
  wealth: number
  income: number
  inheritance: number
  tax: number
  housing: number
  company: number
  financial: number
}

export interface ValidationResult {
  totals: PersonaCollectionTotals
  expectedTotals: PersonaCollectionTotals
  deviations: {
    wealth: number
    income: number
    inheritance: number
    tax: number
    housing: number
    company: number
    financial: number
  }
}

const germanyConfig = {
  totalWealth: 13000e9, // 13 trillion euros
  totalIncome: 2580e9,  // 2,580 billion euros
  totalInheritance: 400e9, // 400 billion euros annually
  totalHouseholds: 42e6, // 42 million households
  annualDeaths: 1e6     // ~1 million deaths per year
}

export function validatePersonaCollection(collection: PersonaCollection): ValidationResult {
  const personasCount = collection.personas.length
  const householdsPerPersona = 42e6 / personasCount
  const estatesPerPersona = germanyConfig.annualDeaths / personasCount

  // Calculate actual totals
  const totals = {
    wealth: collection.personas.reduce((sum, p) => sum + p.currentWealth * householdsPerPersona, 0),
    income: collection.personas.reduce((sum, p) => sum + p.currentIncome * householdsPerPersona, 0),
    inheritance: collection.personas.reduce((sum, p) => sum + p.inheritanceAmount * estatesPerPersona, 0),
    tax: collection.personas.reduce((sum, p) => sum + p.inheritanceTax * estatesPerPersona, 0),
    housing: collection.personas.reduce((sum, p) => sum + p.inheritanceHousing * estatesPerPersona, 0),
    company: collection.personas.reduce((sum, p) => sum + p.inheritanceCompany * estatesPerPersona, 0),
    financial: collection.personas.reduce((sum, p) => sum + p.inheritanceFinancial * estatesPerPersona, 0)
  }

  // Expected totals based on Germany's configuration
  const expectedTotals = {
    wealth: germanyConfig.totalWealth,
    income: germanyConfig.totalIncome,
    inheritance: germanyConfig.totalInheritance,
    tax: 11e9, // 11 billion euros
    housing: germanyConfig.totalInheritance * 0.50, // 50% housing
    company: germanyConfig.totalInheritance * 0.20, // 20% company
    financial: germanyConfig.totalInheritance * 0.30 // 30% financial
  }

  // Calculate deviations as percentages
  const deviations = {
    wealth: (totals.wealth - expectedTotals.wealth) / expectedTotals.wealth * 100,
    income: (totals.income - expectedTotals.income) / expectedTotals.income * 100,
    inheritance: (totals.inheritance - expectedTotals.inheritance) / expectedTotals.inheritance * 100,
    tax: (totals.tax - expectedTotals.tax) / expectedTotals.tax * 100,
    housing: (totals.housing - expectedTotals.housing) / expectedTotals.housing * 100,
    company: (totals.company - expectedTotals.company) / expectedTotals.company * 100,
    financial: (totals.financial - expectedTotals.financial) / expectedTotals.financial * 100
  }

  return {
    totals,
    expectedTotals,
    deviations
  }
}

// Helper function to format the validation results for display
export function formatValidationResults(results: ValidationResult): string {
  const formatNumber = (n: number) => (n / 1e9).toFixed(1) + " Mrd. €"
  const formatDeviation = (d: number) => d.toFixed(1) + "%"

  return `
Validation Results:

Wealth:
  Actual: ${formatNumber(results.totals.wealth)}
  Expected: ${formatNumber(results.expectedTotals.wealth)}
  Deviation: ${formatDeviation(results.deviations.wealth)}

Income:
  Actual: ${formatNumber(results.totals.income)}
  Expected: ${formatNumber(results.expectedTotals.income)}
  Deviation: ${formatDeviation(results.deviations.income)}

Inheritance:
  Actual: ${formatNumber(results.totals.inheritance)}
  Expected: ${formatNumber(results.expectedTotals.inheritance)}
  Deviation: ${formatDeviation(results.deviations.inheritance)}

Tax:
  Actual: ${formatNumber(results.totals.tax)}
  Expected: ${formatNumber(results.expectedTotals.tax)}
  Deviation: ${formatDeviation(results.deviations.tax)}

Housing:
  Actual: ${formatNumber(results.totals.housing)}
  Expected: ${formatNumber(results.expectedTotals.housing)}
  Deviation: ${formatDeviation(results.deviations.housing)}

Company:
  Actual: ${formatNumber(results.totals.company)}
  Expected: ${formatNumber(results.expectedTotals.company)}
  Deviation: ${formatDeviation(results.deviations.company)}

Financial:
  Actual: ${formatNumber(results.totals.financial)}
  Expected: ${formatNumber(results.expectedTotals.financial)}
  Deviation: ${formatDeviation(results.deviations.financial)}
`
}
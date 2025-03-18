import { useLifeIncomeCalculator } from "./useLifeIncomeCalculator"
import { LifeIncomeCalculatorResult } from "./useLifeIncomeCalculator"
import { Persona } from "@/types/persona"
import { avgPersonas } from "@/types/persona"
import { TaxScenario } from "@/types/life-income"
import { useMemo } from 'react'
import { useTaxScenario } from "./useTaxScenario"

export interface PersonaSegmentStats {
  persona: Persona
  totalTaxPaid: number
  totalIncomeReceived: number
  totalWealth: number
  totalVATPaid: number
  totalInheritanceReceived: number
  totalInheritanceTaxPaid: number
  totalSpending: number
  totalSavings: number
  totalSpendingFromWealth: number
  totalSpendingFromIncome: number
  averageTaxRate: number
  averageIncomeTaxRate: number
  averageWealthTaxRate: number
  populationSize: number
  yearlyAverages: {
    taxPaid: number
    incomeReceived: number
    wealth: number
    vatPaid: number
    inheritanceReceived: number
    inheritanceTaxPaid: number
    spending: number
    savings: number
    spendingFromWealth: number
    spendingFromIncome: number
    taxRate: number
  }
  taxDistribution: {
    incomeTax: number
    vat: number
    wealthTax: number
    wealthIncomeTax: number
    total: number
  }
  results: LifeIncomeCalculatorResult
}

const emptyStats: PersonaSegmentStats = {
  persona: {} as Persona,
  totalTaxPaid: 0,
  totalIncomeReceived: 0,
  totalWealth: 0,
  totalVATPaid: 0,
  totalInheritanceReceived: 0,
  totalInheritanceTaxPaid: 0,
  totalSpending: 0,
  totalSavings: 0,
  totalSpendingFromWealth: 0,
  totalSpendingFromIncome: 0,
  averageTaxRate: 0,
  averageIncomeTaxRate: 0,
  averageWealthTaxRate: 0,
  populationSize: 0,
  yearlyAverages: {
    taxPaid: 0,
    incomeReceived: 0,
    wealth: 0,
    vatPaid: 0,
    inheritanceReceived: 0,
    inheritanceTaxPaid: 0,
    spending: 0,
    savings: 0,
    spendingFromWealth: 0,
    spendingFromIncome: 0,
    taxRate: 0
  },
  taxDistribution: {
    incomeTax: 0,
    vat: 0,
    wealthTax: 0,
    wealthIncomeTax: 0,
    total: 0
  },
  results: {
    totals: {
      totalIncome: 0,
      totalIncomeTax: 0,
      totalWealth: 0,
      totalWealthTax: 0,
      totalVAT: 0,
      totalInheritance: 0,
      totalInheritanceTax: 0,
      totalSpending: 0,
      totalSavings: 0,
      totalSpendingFromWealth: 0,
      totalSpendingFromIncome: 0,
      totalTax: 0,
      totalTaxWithVAT: 0,
      totalWealthGrowth: 0,
      totalWealthIncome: 0,
      totalWealthIncomeTax: 0
    },
    details: []
  }
}

// Define a scaling factor
const personaScale = 8300000; // Example scaling factor to represent a larger segment

// Helper function to scale values
const scaleValue = (value: number): number => value * personaScale;

export function usePersonaSegmentCalculator(persona: Persona, taxScenario?: TaxScenario): PersonaSegmentStats {
  const { calculateLifeIncome } = useLifeIncomeCalculator()
  const { taxParams } = useTaxScenario()

  return useMemo(() => {
    // Skip if persona is undefined or missing required properties
    if (!persona || !persona.currentIncome || !persona.currentAge) {
      return emptyStats
    }

    const results = calculateLifeIncome({
      ...persona,
      currentAge: persona.currentAge,
      currentPersona: persona,
      inheritanceAge: persona.inheritanceAge ?? 20,
      inheritanceTaxableHousingFinancial: persona.inheritanceAmount,
      inheritanceTaxableCompany: 0,
      inheritanceHardship: false,
      taxScenario
    })

    if (!results) {
      return emptyStats
    }

    const totalYears = results.details.length
    const yearlyAverages = {
      taxPaid: (results.totals.totalIncomeTax + results.totals.totalWealthTax + results.totals.totalVAT + results.totals.totalInheritanceTax) / totalYears,
      incomeReceived: (results.totals.totalIncome + results.totals.totalWealthIncome) / totalYears,
      wealth: results.totals.totalWealth / totalYears,
      vatPaid: results.totals.totalVAT / totalYears,
      inheritanceReceived: results.totals.totalInheritance / totalYears,
      inheritanceTaxPaid: results.totals.totalInheritanceTax / totalYears,
      spending: results.totals.totalSpending / totalYears,
      savings: results.totals.totalSavings / totalYears,
      spendingFromWealth: results.totals.totalSpendingFromWealth / totalYears,
      spendingFromIncome: results.totals.totalSpendingFromIncome / totalYears,
      taxRate: (results.totals.totalIncomeTax + results.totals.totalWealthTax + results.totals.totalVAT + results.totals.totalInheritanceTax) /
        (results.totals.totalIncome + results.totals.totalWealthIncome + results.totals.totalInheritance)
    }

    return {
      persona,
      totalTaxPaid: scaleValue(yearlyAverages.taxPaid),
      totalIncomeReceived: scaleValue(yearlyAverages.incomeReceived),
      totalWealth: scaleValue(yearlyAverages.wealth),
      totalVATPaid: scaleValue(yearlyAverages.vatPaid),
      totalInheritanceReceived: scaleValue(yearlyAverages.inheritanceReceived),
      totalInheritanceTaxPaid: scaleValue(yearlyAverages.inheritanceTaxPaid),
      totalSpending: scaleValue(yearlyAverages.spending),
      totalSavings: scaleValue(yearlyAverages.savings),
      totalSpendingFromWealth: scaleValue(yearlyAverages.spendingFromWealth),
      totalSpendingFromIncome: scaleValue(yearlyAverages.spendingFromIncome),
      averageTaxRate: (yearlyAverages.taxPaid - yearlyAverages.vatPaid - yearlyAverages.inheritanceTaxPaid) / yearlyAverages.taxPaid,
      averageIncomeTaxRate: yearlyAverages.incomeReceived / yearlyAverages.taxPaid,
      averageWealthTaxRate: yearlyAverages.vatPaid / yearlyAverages.taxPaid,
      populationSize: 1,
      yearlyAverages,
      taxDistribution: {
        incomeTax: (yearlyAverages.taxPaid - yearlyAverages.vatPaid - yearlyAverages.inheritanceTaxPaid) / yearlyAverages.taxPaid,
        wealthTax: yearlyAverages.vatPaid / yearlyAverages.taxPaid,
        vat: yearlyAverages.vatPaid / yearlyAverages.taxPaid,
        wealthIncomeTax: (yearlyAverages.taxPaid - yearlyAverages.vatPaid - yearlyAverages.inheritanceTaxPaid) / yearlyAverages.taxPaid,
        total: yearlyAverages.taxPaid
      },
      results
    }
  }, [persona, taxScenario, calculateLifeIncome, taxParams]) // Add taxParams as a dependency
}

export function usePersonaSegmentCollectionCalculator(personas: Persona[], taxScenario?: TaxScenario): { personaStats: PersonaSegmentStats[]; aggregatedStats: PersonaSegmentStats } {
  // Call hooks at the top level for each persona
  const individualStats = personas.map(persona => usePersonaSegmentCalculator(persona, taxScenario));

  // Then memoize the final stats array and include taxScenario in dependencies
  const personaStats = useMemo(() => individualStats, [individualStats, taxScenario]);

  const aggregatedStats = useMemo(() => {
    return personaStats.reduce((acc, stats) => {
      acc.totalTaxPaid += stats.totalTaxPaid;
      acc.totalIncomeReceived += stats.totalIncomeReceived;
      acc.totalWealth += stats.totalWealth;
      acc.totalVATPaid += stats.totalVATPaid;
      acc.totalInheritanceReceived += stats.totalInheritanceReceived;
      acc.totalInheritanceTaxPaid += stats.totalInheritanceTaxPaid;
      acc.totalSpending += stats.totalSpending;
      acc.totalSavings += stats.totalSavings;
      acc.totalSpendingFromWealth += stats.totalSpendingFromWealth;
      acc.totalSpendingFromIncome += stats.totalSpendingFromIncome;
      acc.populationSize += 1;
      return acc;
    }, { ...emptyStats });
  }, [personaStats]);

  return {
    personaStats,
    aggregatedStats: {
      ...aggregatedStats,
      averageTaxRate: (aggregatedStats.totalTaxPaid - aggregatedStats.totalVATPaid - aggregatedStats.totalInheritanceTaxPaid) / aggregatedStats.totalTaxPaid,
      averageIncomeTaxRate: aggregatedStats.totalIncomeReceived / aggregatedStats.totalTaxPaid,
      averageWealthTaxRate: aggregatedStats.totalVATPaid / aggregatedStats.totalTaxPaid,
      yearlyAverages: {
        taxPaid: aggregatedStats.totalTaxPaid / aggregatedStats.populationSize,
        incomeReceived: aggregatedStats.totalIncomeReceived / aggregatedStats.populationSize,
        wealth: aggregatedStats.totalWealth / aggregatedStats.populationSize,
        vatPaid: aggregatedStats.totalVATPaid / aggregatedStats.populationSize,
        inheritanceReceived: aggregatedStats.totalInheritanceReceived / aggregatedStats.populationSize,
        inheritanceTaxPaid: aggregatedStats.totalInheritanceTaxPaid / aggregatedStats.populationSize,
        spending: aggregatedStats.totalSpending / aggregatedStats.populationSize,
        savings: aggregatedStats.totalSavings / aggregatedStats.populationSize,
        spendingFromWealth: aggregatedStats.totalSpendingFromWealth / aggregatedStats.populationSize,
        spendingFromIncome: aggregatedStats.totalSpendingFromIncome / aggregatedStats.populationSize,
        taxRate: aggregatedStats.totalTaxPaid / (aggregatedStats.totalIncomeReceived + aggregatedStats.totalWealth)
      },
      taxDistribution: {
        incomeTax: (aggregatedStats.totalTaxPaid - aggregatedStats.totalVATPaid - aggregatedStats.totalInheritanceTaxPaid) / aggregatedStats.totalTaxPaid,
        wealthTax: aggregatedStats.totalVATPaid / aggregatedStats.totalTaxPaid,
        vat: aggregatedStats.totalVATPaid / aggregatedStats.totalTaxPaid,
        wealthIncomeTax: (aggregatedStats.totalTaxPaid - aggregatedStats.totalVATPaid - aggregatedStats.totalInheritanceTaxPaid) / aggregatedStats.totalTaxPaid,
        total: aggregatedStats.totalTaxPaid
      }
    }
  };
}
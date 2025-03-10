import { useLifeIncomeCalculator } from "./useLifeIncomeCalculator"
import { LifeIncomeCalculatorResult } from "./useLifeIncomeCalculator"
import { Persona } from "@/types/persona"
import { avgPersonas } from "@/types/persona"

interface PersonaSegmentStats {
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
  // taxDistribution: {
  //   incomeTax: number
  //   vat: number
  //   wealthTax: number
  //   wealthIncomeTax: number
  //   total: number
  // }
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
  // taxDistribution: {
  //   incomeTax: 0,
  //   vat: 0,
  //   wealthTax: 0,
  //   wealthIncomeTax: 0,
  //   total: 0
  // }
}

// Define a scaling factor
const personaScale = 8300000; // Example scaling factor to represent a larger segment

// Helper function to scale values
const scaleValue = (value: number): number => value * personaScale;

export function usePersonaSegmentCalculator(persona: Persona): PersonaSegmentStats {
  const { calculateLifeIncome } = useLifeIncomeCalculator()

  const calculatePersonaSegmentStats = (): PersonaSegmentStats => {
    // Skip if persona is undefined or missing required properties
    if (!persona || !persona.currentIncome || !persona.currentAge) {
      return emptyStats
    }

    const result = calculateLifeIncome({
      currentIncome: persona.currentIncome,
      currentAge: persona.currentAge,
      savingsRate: persona.savingsRate,
      inheritanceAge: persona.inheritanceAge || 20,
      inheritanceAmount: persona.inheritanceAmount,
      inheritanceTaxClass: persona.inheritanceTaxClass,
      vatRate: persona.vatRate,
      vatApplicableRate: persona.vatApplicableRate,
      yearlySpendingFromWealth: persona.yearlySpendingFromWealth,
      currentWealth: persona.currentWealth,
      currentPersona: persona
    })

    if (!result) {
      return emptyStats
    }

    const totalYears = result.details.length
    const yearlyAverages = {
      taxPaid: (result.totals.totalIncomeTax + result.totals.totalWealthTax + result.totals.totalVAT + result.totals.totalInheritanceTax) / totalYears,
      incomeReceived: (result.totals.totalIncome + result.totals.totalWealthIncome) / totalYears,
      wealth: result.totals.totalWealth / totalYears,
      vatPaid: result.totals.totalVAT / totalYears,
      inheritanceReceived: result.totals.totalInheritance / totalYears,
      inheritanceTaxPaid: result.totals.totalInheritanceTax / totalYears,
      spending: result.totals.totalSpending / totalYears,
      savings: result.totals.totalSavings / totalYears,
      spendingFromWealth: result.totals.totalSpendingFromWealth / totalYears,
      spendingFromIncome: result.totals.totalSpendingFromIncome / totalYears,
      taxRate: (result.totals.totalIncomeTax + result.totals.totalWealthTax + result.totals.totalVAT + result.totals.totalInheritanceTax) /
        (result.totals.totalIncome + result.totals.totalWealthIncome + result.totals.totalInheritance)
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
      // taxDistribution: {
      //   incomeTax: (yearlyAverages.taxPaid - yearlyAverages.vatPaid - yearlyAverages.inheritanceTaxPaid) / yearlyAverages.taxPaid,
      //   wealthTax: yearlyAverages.vatPaid / yearlyAverages.taxPaid,
      //   vat: yearlyAverages.vatPaid / yearlyAverages.taxPaid,
      //   wealthIncomeTax: (yearlyAverages.taxPaid - yearlyAverages.vatPaid - yearlyAverages.inheritanceTaxPaid) / yearlyAverages.taxPaid,
      //   total: yearlyAverages.taxPaid
      // }
    }
  }

  return calculatePersonaSegmentStats()
}

export function usePersonaSegmentCollectionCalculator(personas: Persona[]): { personaStats: PersonaSegmentStats[]; aggregatedStats: PersonaSegmentStats } {
  const personaStats = personas.map(persona => usePersonaSegmentCalculator(persona));

  const aggregatedStats = personaStats.reduce((acc, stats) => {
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
  }, emptyStats);

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
      },
      // taxDistribution: {
      //   incomeTax: (aggregatedStats.totalTaxPaid - aggregatedStats.totalVATPaid - aggregatedStats.totalInheritanceTaxPaid) / aggregatedStats.totalTaxPaid,
      //   wealthTax: aggregatedStats.totalVATPaid / aggregatedStats.totalTaxPaid,
      //   vat: aggregatedStats.totalVATPaid / aggregatedStats.totalTaxPaid,
      //   wealthIncomeTax: (aggregatedStats.totalTaxPaid - aggregatedStats.totalVATPaid - aggregatedStats.totalInheritanceTaxPaid) / aggregatedStats.totalTaxPaid,
      //   total: aggregatedStats.totalTaxPaid
      // }
    }
  };
}
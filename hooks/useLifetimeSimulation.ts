"use client"

import { useMemo } from "react"
import type { Persona } from "@/types/persona"

// Tax calculation functions
const calculateFlatTax = (income: number, rate: number) => income * rate
const calculateProgressiveTax = (income: number, brackets: [number, number][]) => {
  let tax = 0
  let remainingIncome = income

  for (const [threshold, rate] of brackets) {
    if (remainingIncome <= 0) break
    const taxableAmount = Math.min(remainingIncome, threshold)
    tax += taxableAmount * rate
    remainingIncome -= taxableAmount
  }

  return tax
}

export function useLifetimeSimulation(persona: Persona, scenario: string) {
  const simulationResult = useMemo(() => {
    const retirementAge = 67
    const yearlyData = []
    let totalIncome = 0
    let totalWealth = 0
    let totalTaxesPaid = 0
    let totalSpending = 0
    for (let age = persona.initialAge; age <= retirementAge; age++) {
      const yearIncome = persona.currentIncome * Math.pow(persona.incomeGrowth(age), age - persona.initialAge)
      let yearTax = 0

      switch (scenario) {
        case "flat":
          yearTax = calculateFlatTax(yearIncome, 0.1613)
          break
        case "progressive-flat":
          yearTax = calculateProgressiveTax(yearIncome, [
            [11604, 0],
            [5401, 0.14 * 0.766],
            [49756, 0.24 * 0.766],
            [211065, 0.42 * 0.766],
            [Number.POSITIVE_INFINITY, 0.45 * 0.766],
          ])
          break
        case "no-exceptions":
          yearTax = calculateProgressiveTax(yearIncome, [
            [11604, 0],
            [5401, 0.14],
            [49756, 0.24],
            [211065, 0.42],
            [Number.POSITIVE_INFINITY, 0.45],
          ])
          break
        case "loophole-removal":
          yearTax = calculateProgressiveTax(yearIncome, [
            [11604, 0],
            [5401, 0.14 * 0.567],
            [49756, 0.24 * 0.567],
            [211065, 0.42 * 0.567],
            [Number.POSITIVE_INFINITY, 0.45 * 0.567],
          ])
          break
      }

      const yearSavings = (yearIncome - yearTax) * persona.savingsRate
      totalIncome += yearIncome
      totalTaxesPaid += yearTax
      totalWealth += yearSavings

      if (persona.yearlySpendingFromWealth) {
        totalSpending += persona.yearlySpendingFromWealth
      } else {
        totalSpending += (yearIncome - yearTax) - yearSavings
      }


      if (age === persona.inheritanceAge) {
        let inheritanceTax = 0
        switch (scenario) {
          case "flat":
            inheritanceTax = calculateFlatTax(persona.inheritanceAmount, 0.1613)
            break
          case "progressive-flat":
            inheritanceTax = calculateProgressiveTax(persona.inheritanceAmount, [
              [75000, 0.07 * 0.766],
              [300000, 0.11 * 0.766],
              [600000, 0.15 * 0.766],
              [6000000, 0.19 * 0.766],
              [13000000, 0.23 * 0.766],
              [26000000, 0.27 * 0.766],
              [Number.POSITIVE_INFINITY, 0.3 * 0.766],
            ])
            break
          case "no-exceptions":
          case "loophole-removal":
            inheritanceTax = calculateProgressiveTax(persona.inheritanceAmount, [
              [75000, 0.07],
              [300000, 0.11],
              [600000, 0.15],
              [6000000, 0.19],
              [13000000, 0.23],
              [26000000, 0.27],
              [Number.POSITIVE_INFINITY, 0.3],
            ])
            break
        }
        totalTaxesPaid += inheritanceTax
        totalWealth += persona.inheritanceAmount - inheritanceTax
      }

      yearlyData.push({
        age,
        income: yearIncome,
        wealth: totalWealth,
        taxesPaid: yearTax,
      })
    }

    return {
      yearlyData,
      totalIncome,
      totalSpending,
      totalWealth,
      totalTaxesPaid,
      effectiveTaxRate: totalTaxesPaid / totalIncome,
    }
  }, [persona, scenario])

  return simulationResult
}


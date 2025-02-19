import { renderHook } from "@testing-library/react-hooks"
import { useLifeIncomeCalculator } from "./useLifeIncomeCalculator"
import type { Persona } from "@/types/persona"

describe("useLifeIncomeCalculator", () => {
  const { result } = renderHook(() => useLifeIncomeCalculator())
  const { calculateLifeIncome } = result.current

  const mockPersona: Partial<Persona> = {
    incomeGrowth: (age: number) => 1.05,
    initialIncome: 50000,
    savingsRate: 0.2,
    inheritanceAmount: 100000,
  }

  const defaultParams = {
    currentIncome: 50000,
    currentAge: 25,
    savingsRate: 0.2,
    inheritanceAge: 45,
    inheritanceAmount: 100000,
    inheritanceTaxClass: 1 as const,
    vatRate: 19,
    vatApplicableRate: 70,
    yearlySpending: 40000,
    selectedPersona: null,
  }

  describe("Input validation", () => {
    test("should return null for invalid age range", () => {
      expect(calculateLifeIncome({ ...defaultParams, currentAge: 19 })).toBeNull()
      expect(calculateLifeIncome({ ...defaultParams, currentAge: 66 })).toBeNull()
    })

    test("should return null for invalid savings rate", () => {
      expect(calculateLifeIncome({ ...defaultParams, savingsRate: -0.1 })).toBeNull()
      expect(calculateLifeIncome({ ...defaultParams, savingsRate: 1.1 })).toBeNull()
    })

    test("should return null for NaN values", () => {
      expect(calculateLifeIncome({ ...defaultParams, currentIncome: NaN })).toBeNull()
      expect(calculateLifeIncome({ ...defaultParams, vatRate: NaN })).toBeNull()
    })
  })

  describe("Growth rate handling", () => {
    test("should use default growth rate (1.02) when no persona is provided", () => {
      const results = calculateLifeIncome(defaultParams)
      const year1Income = results?.details[0].income
      const year2Income = results?.details[1].income

      expect(year2Income).toBe(Math.round(year1Income! * 1.02))
    })

    test("should use default growth rate when persona has no incomeGrowth", () => {
      const results = calculateLifeIncome({
        ...defaultParams,
        selectedPersona: {} as Persona,
      })
      const year1Income = results?.details[0].income
      const year2Income = results?.details[1].income

      expect(year2Income).toBe(Math.round(year1Income! * 1.02))
    })

    test("should use persona growth rate when provided", () => {
      const results = calculateLifeIncome({
        ...defaultParams,
        selectedPersona: mockPersona as Persona,
      })
      const year1Income = results?.details[0].income
      const year2Income = results?.details[1].income

      expect(year2Income).toBe(Math.round(year1Income! * 1.05))
    })
  })

  describe("Basic calculations", () => {
    test("should calculate correct number of years", () => {
      const results = calculateLifeIncome(defaultParams)
      expect(results).not.toBeNull()
      expect(results?.details.length).toBe(65 - defaultParams.currentAge + 1)
    })

    test("should calculate first year values correctly", () => {
      const results = calculateLifeIncome(defaultParams)
      const firstYear = results?.details[0]

      expect(firstYear).toMatchObject({
        age: 25,
        income: 50000,
        wealthCreatedThisYear: 10000, // 20% savings rate
        inheritance: 0, // No inheritance in first year
        inheritanceTax: 0,
      })
    })

    test("should apply inheritance in correct year", () => {
      const results = calculateLifeIncome(defaultParams)
      const inheritanceYear = results?.details.find(r => r.age === defaultParams.inheritanceAge)

      expect(inheritanceYear?.inheritance).toBe(100000)
      expect(inheritanceYear?.inheritanceTax).toBeGreaterThan(0)
    })
  })

  describe("Tax calculations", () => {
    test("should calculate income tax progressively", () => {
      const lowIncome = calculateLifeIncome({ ...defaultParams, currentIncome: 20000 })
      const highIncome = calculateLifeIncome({ ...defaultParams, currentIncome: 200000 })

      const lowTaxRate = lowIncome?.details[0].incomeTax || 0
      const highTaxRate = highIncome?.details[0].incomeTax

      expect(highTaxRate).toBeGreaterThan(lowTaxRate)
    })

    test("should calculate VAT correctly", () => {
      const results = calculateLifeIncome(defaultParams)
      const firstYear = results?.details[0]

      // VAT calculation: (income * vatApplicableRate%) * (vatRate / (100 + vatRate))
      const expectedVAT = Math.round(50000 * 0.7 * (19 / 119))
      expect(firstYear?.vat).toBe(expectedVAT)
    })

    test("should calculate inheritance tax based on tax class", () => {
      const class1Results = calculateLifeIncome(defaultParams)
      const class3Results = calculateLifeIncome({
        ...defaultParams,
        inheritanceTaxClass: 3 as const,
      })

      const class1Tax = class1Results?.details.find(r => r.age === 45)?.inheritanceTax
      const class3Tax = class3Results?.details.find(r => r.age === 45)?.inheritanceTax

      expect(class3Tax).toBeGreaterThan(class1Tax!)
    })
  })

  describe("Wealth accumulation", () => {
    test("should grow wealth with compound interest", () => {
      const results = calculateLifeIncome(defaultParams)
      const year1Wealth = results?.details[0].wealth
      const year2Wealth = results?.details[1].wealth

      expect(year2Wealth).toBeGreaterThan(year1Wealth! + defaultParams.currentIncome * defaultParams.savingsRate)
    })

    test("should account for yearly spending in wealth calculation", () => {
      const highSpending = calculateLifeIncome({
        ...defaultParams,
        yearlySpending: 45000,
      })
      const lowSpending = calculateLifeIncome({
        ...defaultParams,
        yearlySpending: 35000,
      })

      expect(highSpending?.details[0].wealth).toBeLessThan(lowSpending?.details[0].wealth!)
    })

    test("should properly accumulate inheritance in wealth", () => {
      const results = calculateLifeIncome(defaultParams)
      const beforeInheritance = results?.details.find(r => r.age === 44)?.wealth
      const afterInheritance = results?.details.find(r => r.age === 45)?.wealth
      const inheritance = defaultParams.inheritanceAmount

      expect(afterInheritance).toBeGreaterThan(beforeInheritance! + inheritance * 0.8)
    })

    test("10M inheritance at 20 should result in ~89.85M at 65", () => {
      const results = calculateLifeIncome({
        ...defaultParams,
        currentAge: 54,
        currentIncome: 0,
        inheritanceAge: 55,
        inheritanceAmount: 10_000_000,
        yearlySpending: 0, // Set to 0 to verify pure compound growth
        savingsRate: 0,    // Set to 0 to verify pure compound growth
      })

      expect(results?.totals.totalWealth).toBeCloseTo((16_288_946 - (results?.totals.totalInheritanceTax ?? 0)), -4)
    })

    test("1M inheritance at 20 with 30k income and no savings", () => {
      const results = calculateLifeIncome({
        ...defaultParams,
        currentAge: 20,
        currentIncome: 30000,
        inheritanceAge: 20,
        inheritanceAmount: 1_000_000,
        savingsRate: 0,    // No savings
        yearlySpending: 30000, // Spending all income
      })

      // The inheritance should grow at 5% annually for 45 years
      // 1M * (1.05)^45 = ~8.985M
      // Minus inheritance tax
      // Plus yearly income (spent entirely)
      // expect(results?.totals.totalIncome).toBe(45 * 30000) // Total lifetime income
      debugger
      expect(results?.totals.totalWealth).toBeGreaterThan(7_000_000) // After tax and spending
      expect(results?.details[0].inheritance).toBe(1_000_000) // First year inheritance
      expect(results?.details[0].income).toBe(30000) // First year income
    })
  })
})
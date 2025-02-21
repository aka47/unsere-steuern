import { renderHook } from "@testing-library/react-hooks"
import { useLifeIncomeCalculator } from "./useLifeIncomeCalculator"
import { type Persona, initialPersonas } from "@/types/persona"

describe("useLifeIncomeCalculator", () => {
  const { result } = renderHook(() => useLifeIncomeCalculator())
  const { calculateLifeIncome } = result.current

  const mockPersona: Partial<Persona> = {
    incomeGrowth: (age: number) => 1.05,
    currentIncome: 50000,
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
    yearlySpendingFromWealth: 0,
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
    test("should account for yearly spending in wealth calculation", () => {
      const highSpending = calculateLifeIncome({
        ...defaultParams,
        yearlySpendingFromWealth: 45000,
      })
      const lowSpending = calculateLifeIncome({
        ...defaultParams,
        yearlySpendingFromWealth: 35000,
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
  })

  describe("Persona-specific calculations", () => {
    test("CEO persona calculation", () => {
      const ceoPersona = initialPersonas.find((p: Persona) => p.id === "ceo")!
      const results = calculateLifeIncome({
        ...defaultParams,
        ...ceoPersona,
        inheritanceAge: ceoPersona.inheritanceAge ?? 0,
        selectedPersona: ceoPersona,
      })

      expect(ceoPersona.initialAge).toBe(20)

      expect(results?.details[0].income).toBe(30000)
      expect(results?.details[0].incomeTax).toBe(4304)
      expect(results?.details[0].savings).toBe(6000)

      expect(results?.details[5].income).toBe(38288)
      expect(results?.details[5].incomeTax).toBe(6779)
      expect(results?.details[5].savings).toBe(7658)
      expect(results?.details[5].wealth).toBe(45946)

      expect(results?.details[45].income).toBe(802783) // - should be 802810
      expect(results?.details[45].incomeTax).toBe(342006) // - should be 342018
      expect(results?.details[45].savings).toBe(160557) // should be 160562
      expect(results?.details[45].wealth).toBe(3766407) // should be 3766516

      expect(results?.totals).toMatchObject({
        totalIncome: 10175454, // 10175782
        totalIncomeTax: 3915832, // 3915976
        totalVAT: expect.any(Number),
        totalInheritance: 0,
        totalInheritanceTax: 0,
        totalWealth: 3766407,
        totalSpending: 4224532, // 4224650
      })
    })

    test("Single mother persona calculation", () => {
      const singleMotherPersona = initialPersonas.find((p: Persona) => p.id === "single-mother")!
      const results = calculateLifeIncome({
        ...defaultParams,
        ...singleMotherPersona,
        inheritanceAge: singleMotherPersona.inheritanceAge ?? 0,
        selectedPersona: singleMotherPersona,
      })

      expect(singleMotherPersona.initialAge).toBe(20)

      expect(results?.details[0].income).toBe(20000)
      expect(results?.details[0].incomeTax).toBe(1640)
      expect(results?.details[0].savings).toBe(0)

      expect(results?.details[5].income).toBe(21020)
      expect(results?.details[5].incomeTax).toBe(1895)
      expect(results?.details[5].spending).toBe(19125)
      expect(results?.details[5].wealth).toBe(0)

      expect(results?.details[45].income).toBe(51095) // - should be 51096
      expect(results?.details[45].incomeTax).toBe(11082) // - should be 11082
      expect(results?.details[45].spending).toBe(40013) // should be 40014
      expect(results?.details[45].wealth).toBe(0) // should be 3766516

      expect(results?.totals).toMatchObject({
        totalIncome: 1381201, // 1381221
        totalIncomeTax: 205295, // 205302
        totalVAT: expect.any(Number),
        totalInheritance: 0,
        totalInheritanceTax: 0,
        totalWealth: 0,
        totalSpending: 1175905, // 1175919
      })
    })

    test("Average worker persona calculation", () => {
      const avgWorkerPersona = initialPersonas.find((p: Persona) => p.id === "avg-worker")!
      const results = calculateLifeIncome({
        ...defaultParams,
        ...avgWorkerPersona,
        inheritanceAge: avgWorkerPersona.inheritanceAge ?? 0,
        selectedPersona: avgWorkerPersona,
      })

      expect(avgWorkerPersona.initialAge).toBe(20)

      expect(results?.details[0].income).toBe(30000)
      expect(results?.details[0].incomeTax).toBe(4304)
      expect(results?.details[0].savings).toBe(1500)

      expect(results?.details[5].income).toBe(33122)
      expect(results?.details[5].incomeTax).toBe(5208)
      expect(results?.details[5].spending).toBe(26259)
      expect(results?.details[5].wealth).toBe(10697)

      expect(results?.details[45].income).toBe(49218) // - should be 49218
      expect(results?.details[45].incomeTax).toBe(10415) // - should be 10415
      expect(results?.details[45].spending).toBe(36342) // should be 36342
      expect(results?.details[45].wealth).toBe(331078) // should be 331081

      expect(results?.totals).toMatchObject({
        totalIncome: 1994474, // 1994491
        totalIncomeTax: 390680, // 390685
        totalVAT: expect.any(Number),
        totalInheritance: 0,
        totalInheritanceTax: 0,
        totalWealth: 331078,
        totalSpending: 1504070, // 1504081
      })
    })

    test("Manager with inheritance persona calculation", () => {
      const managerPersona = initialPersonas.find((p: Persona) => p.id === "manager")!
      const results = calculateLifeIncome({
        ...defaultParams,
        ...managerPersona,
        inheritanceAge: managerPersona.inheritanceAge ?? 0,
        selectedPersona: managerPersona,
      })

      expect(managerPersona.initialAge).toBe(25)

      expect(results?.details[0].income).toBe(39176)
      expect(results?.details[0].incomeTax).toBe(7059)

      expect(results?.details[5].income).toBe(50001)
      expect(results?.details[5].incomeTax).toBe(10692)

      expect(results?.details[40].income).toBe(154461) // should be 154458
      expect(results?.details[40].incomeTax).toBe(53962) // should be 53960


      expect(results?.totals).toMatchObject({
        totalIncome: 3975541, // 3975454
        totalIncomeTax: 1229734, // 1229698
        totalVAT: expect.any(Number),
        totalInheritance: 200000,
        totalInheritanceTax: 0,
        totalWealth: 1924211, // 1903390
      })

    })

    test("Early millionaire heir persona calculation", () => {
      const millionairePersona = initialPersonas.find((p: Persona) => p.id === "inherited-millionaire")!
      const results = calculateLifeIncome({
        ...defaultParams,
        ...millionairePersona,
        inheritanceAge: millionairePersona.inheritanceAge ?? 0,
        selectedPersona: millionairePersona,
      })

      expect(results?.details[0].income).toBe(27172)
      expect(results?.details[0].incomeTax).toBe(3514)
      expect(results?.details[45].income).toBe(66238)
      expect(results?.details[45].incomeTax).toBe(16917)

      expect(results?.details.reduce((sum, year) => sum + (year.income || 0), 0)).toBe(2019613)
      expect(results?.details.reduce((sum, year) => sum + (year.incomeTax || 0), 0)).toBe(406039)

      expect(results?.totals).toMatchObject({
        totalIncome: 2019614,
        totalIncomeTax: 406041,
        totalVAT: expect.any(Number),
        totalInheritance: 1000000,
        totalInheritanceTax: 90000,
        totalWealth: 1837768,
        totalSpending: 3453573
      })
      // Early inheritance with compound growth
      expect(results?.totals.totalInheritance).toBe(millionairePersona.inheritanceAmount)
      expect(results?.totals.totalWealth).toBeGreaterThan(2615) // Significant wealth from early inheritance
    })

    test("Trust fund persona calculation", () => {
      const trustFundPersona = initialPersonas.find((p: Persona) => p.id === "trust-fund")!
      const results = calculateLifeIncome({
        ...defaultParams,
        ...trustFundPersona,
        inheritanceAge: trustFundPersona.inheritanceAge ?? 0,
        selectedPersona: trustFundPersona,
      })

      expect(results?.totals).toMatchObject({
        totalIncome: 0, // No income
        totalIncomeTax: 0, // No income tax
        totalVAT: expect.any(Number),
        totalInheritance: 10000000,
        totalInheritanceTax: 2208000,
        totalWealth: 39774707,
        totalSpending: 9200000,
      })
    })

  })
})
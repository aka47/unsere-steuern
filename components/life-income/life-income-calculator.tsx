"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Persona, defaultPersona } from "@/types/persona"
import { useLifeIncomeCalculator } from "@/hooks/useLifeIncomeCalculator"
import { INHERITANCE_TAX_CLASSES } from "@/constants/tax"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"
import { type LifeIncomeResults, type TaxScenario } from "@/types/life-income"
import { TypographyH4, TypographyP } from "@/components/ui/typography"
import { useSessionPersona } from "@/hooks/useSessionPersona"
import { defaultTaxScenario } from "@/constants/tax-scenarios"
import { YearlyBreakdown } from "@/components/life-income/yearly-breakdown"
import { toast } from "sonner"

interface InfoTooltipProps {
  content: string
}

function InfoTooltip({ content }: InfoTooltipProps) {

  return (
    <Tooltip>
      <TooltipTrigger>
        <InfoIcon className="h-4 w-4 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent>
        <TypographyP>{content}</TypographyP>
      </TooltipContent>
    </Tooltip>
  )
}

interface LifeIncomeCalculatorProps {
  setResults: React.Dispatch<React.SetStateAction<LifeIncomeResults>>
  persona: Persona | null
  setPersona: (persona: Persona | null) => void
}

const validateInheritanceTaxClass = (value: string): keyof typeof INHERITANCE_TAX_CLASSES => {
  const validClasses = ["1", "2", "3"] as const
  const taxClass = validClasses.find(v => v === value) ?? "1"
  return taxClass as unknown as keyof typeof INHERITANCE_TAX_CLASSES
}

export function LifeIncomeCalculator({ setResults, persona, setPersona }: LifeIncomeCalculatorProps) {
  const [currentIncome, setCurrentIncome] = useState(persona?.currentIncome.toString() ?? defaultPersona.currentIncome.toString())
  const [currentAge, setCurrentAge] = useState(persona?.currentAge.toString() ?? defaultPersona.currentAge.toString())
  const [savingsRate, setSavingsRate] = useState(((persona?.savingsRate ?? defaultPersona.savingsRate) * 100).toString())
  const [inheritanceAge, setInheritanceAge] = useState(persona?.inheritanceAge?.toString() ?? defaultPersona.inheritanceAge?.toString() ?? "")
  const [inheritanceAmount, setInheritanceAmount] = useState(persona?.inheritanceAmount?.toString() ?? defaultPersona.inheritanceAmount?.toString() ?? "0")
  const [inheritanceTaxClass, setInheritanceTaxClass] = useState<"1" | "2" | "3">((persona?.inheritanceTaxClass ?? defaultPersona.inheritanceTaxClass).toString() as "1" | "2" | "3")
  const [spending, setSpending] = useState(persona?.yearlySpendingFromWealth?.toString() ?? defaultPersona.yearlySpendingFromWealth?.toString() ?? "0")
  const [wealth, setWealth] = useState(persona?.currentWealth?.toString() ?? defaultPersona.currentWealth?.toString() ?? "0")
  const [selectedTaxScenario] = useState<TaxScenario>(defaultTaxScenario)
  const [yearlyResults, setYearlyResults] = useState<LifeIncomeResults>(null)
  const [showYearlyBreakdown, setShowYearlyBreakdown] = useState(false)
  const { calculateLifeIncome } = useLifeIncomeCalculator()
  const { currentPersona, setCurrentPersona } = useSessionPersona()
  const initializedRef = useRef(false)
  const [isClient, setIsClient] = useState(false)

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Calculate results when persona changes
  useEffect(() => {
    if (!isClient || !persona) return

    // Only initialize once
    if (!initializedRef.current) {
      setCurrentIncome(persona.currentIncome.toString())
      setCurrentAge(persona.currentAge.toString())
      setSavingsRate((persona.savingsRate * 100).toString())
      setInheritanceAge(persona.inheritanceAge?.toString() ?? "")
      setInheritanceAmount(persona.inheritanceAmount?.toString() ?? "0")
      setSpending(persona.yearlySpendingFromWealth?.toString() ?? "0")
      setWealth(persona.currentWealth?.toString() ?? "0")
      setInheritanceTaxClass((persona.inheritanceTaxClass ?? defaultPersona.inheritanceTaxClass).toString() as "1" | "2" | "3")
      initializedRef.current = true
    }

    // Calculate results
    const results = calculateLifeIncome({
      ...persona,
      inheritanceAge: persona.inheritanceAge ?? 0,
      currentPersona,
      inheritanceTaxableHousingFinancial: persona.inheritanceHousing,
      inheritanceTaxableCompany: persona.inheritanceCompany,
      inheritanceHardship: false,
      taxScenario: selectedTaxScenario
    })

    if (results) {
      const { details } = results
      setYearlyResults(details)
      setShowYearlyBreakdown(true)
    }
  }, [persona, currentPersona, selectedTaxScenario, isClient])

  // useEffect(() => {
  //   if (!persona && currentPersona) {
  //     setPersona(currentPersona)
  //   }
  // }, [currentPersona, persona, setPersona])


  const handleCalculation = () => {
    if (!persona) {
      // Create a new persona from current form values, using defaultPersona as base
      const newPersona: Persona = {
        ...defaultPersona,
        name: "Du",
        icon: "👤",
        description: "Ein eigenes Profil",
        currentAge: Number.parseInt(currentAge, 10),
        currentIncome: Number.parseFloat(currentIncome),
        savingsRate: Number.parseFloat(savingsRate) / 100,
        inheritanceAge: inheritanceAge ? Number.parseInt(inheritanceAge, 10) : null,
        inheritanceAmount: Number.parseFloat(inheritanceAmount),
        inheritanceTaxClass: validateInheritanceTaxClass(inheritanceTaxClass),
        yearlySpendingFromWealth: Number.parseFloat(spending),
        currentWealth: Number.parseFloat(wealth),
        yearlyOverrides: []
      }

      // Save to session and update local state
      setPersona(newPersona)
      setCurrentPersona(newPersona)
    }

    const parsedValues = {
      currentIncome: Number.parseFloat(currentIncome),
      currentAge: Number.parseInt(currentAge, 10),
      savingsRate: Number.parseFloat(savingsRate) / 100,
      inheritanceAge: inheritanceAge ? Number.parseInt(inheritanceAge, 10) : 20,
      inheritanceAmount: Number.parseFloat(inheritanceAmount),
      inheritanceTaxClass: validateInheritanceTaxClass(inheritanceTaxClass),
      yearlySpendingFromWealth: Number.parseFloat(spending),
      currentWealth: Number.parseFloat(wealth),
    }
    // Check each validation rule separately and log failures
    const validationErrors = []

    if (Number.isNaN(parsedValues.currentIncome)) {
      validationErrors.push('Current income is invalid')
    }
    if (Number.isNaN(parsedValues.currentAge)) {
      validationErrors.push('Current age is invalid')
    }
    if (Number.isNaN(parsedValues.savingsRate)) {
      validationErrors.push('Savings rate is invalid')
    }
    if (inheritanceAge && Number.isNaN(parsedValues.inheritanceAge)) {
      validationErrors.push('Inheritance age is invalid')
    }
    if (Number.isNaN(parsedValues.inheritanceAmount)) {
      validationErrors.push('Inheritance amount is invalid')
    }
    if (Number.isNaN(parsedValues.yearlySpendingFromWealth)) {
      validationErrors.push('Yearly spending is invalid')
    }
    if (Number.isNaN(parsedValues.currentWealth)) {
      validationErrors.push('Current wealth is invalid')
    }

    if (validationErrors.length > 0) {
      alert("Bitte geben Sie gültige Zahlen ein." + validationErrors.join("\n"))
      console.log(validationErrors)
      return
    }

    const results = calculateLifeIncome({
      ...defaultPersona,
      ...currentPersona,
      ...parsedValues,
      currentPersona: currentPersona ?? undefined,
      inheritanceTaxableHousingFinancial: currentPersona?.inheritanceHousing ?? 0,
      inheritanceTaxableCompany: currentPersona?.inheritanceCompany ?? 0,
      inheritanceHardship: false,
      taxScenario: selectedTaxScenario
    })

    if (!results) {
      alert("Bitte geben Sie gültige Werte ein. Das Alter muss zwischen 20 und 65 liegen.")
      return
    }

    const { details, totals } = results
    setResults(details)
    setYearlyResults(details)
    setShowYearlyBreakdown(true)
    localStorage.setItem("lifeIncomeResults", JSON.stringify(details))

    if (totals) {
      console.log({
        totalIncome: totals.totalIncome,
        totalIncomeTax: totals.totalIncomeTax,
        totalWealthIncome: totals.totalWealthIncome,
        totalWealthIncomeTax: totals.totalWealthIncomeTax,
        totalWealthTax: totals.totalWealthTax,
        finalWealth: totals.totalWealth
      })
    }
  }

  const handleYearlyResultsUpdate = (updatedResults: LifeIncomeResults) => {
    setYearlyResults(updatedResults)
    setResults(updatedResults)
    localStorage.setItem("lifeIncomeResults", JSON.stringify(updatedResults))
  }

  const savePersona = async () => {
    const updatedPersona: Persona = {
      ...defaultPersona, // This ensures all required fields have defaults
      ...persona,
      currentIncome: Number.parseFloat(currentIncome),
      currentAge: Number.parseInt(currentAge, 10),
      savingsRate: Number.parseFloat(savingsRate) / 100,
      inheritanceAge: inheritanceAge ? Number.parseInt(inheritanceAge, 10) : 0,
      inheritanceAmount: Number.parseFloat(inheritanceAmount),
      yearlySpendingFromWealth: Number.parseFloat(spending),
      currentWealth: Number.parseFloat(wealth)
    }

    // save to db in the future
    localStorage.setItem("currentPersona", JSON.stringify(updatedPersona))

    setPersona(updatedPersona)
    setCurrentPersona(updatedPersona)

    toast("Success", {
      description: "Persona erfolgreich gespeichert!"
    })
  }

  return (
    <>
      <div className="grid w-full items-center gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TypographyH4>Einkommen</TypographyH4>
            <InfoTooltip content="Geben Sie Ihr aktuelles Einkommen und Alter ein" />
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="currentIncome">Aktuelles Jahreseinkommen (€)</Label>
              <Input
                id="currentIncome"
                placeholder="z.B. 50000"
                value={currentIncome}
                onChange={(e) => setCurrentIncome(e.target.value)}
                type="number"
                min={0}
                className="w-full"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="currentAge">Aktuelles Alter</Label>
              <Input
                id="currentAge"
                placeholder="z.B. 30"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                type="number"
                min={0}
                max={120}
                className="w-full"
              />
            </div>
            <div className="flex flex-col space-y-1.5 md:col-span-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="savingsRate">Sparrate (%)</Label>
                <TypographyP className="text-muted-foreground">
                  Der monatliche Betrag, den Sie vom Einkommen sparen
                </TypographyP>
                <InfoTooltip content="Der monatliche Betrag, den Sie vom Einkommen sparen" />
              </div>
              {/* <Select value={savingsRate} onValueChange={setSavingsRate}>
                <SelectTrigger id="savingsRate" className="w-full">
                  <SelectValue placeholder="Wählen Sie eine Sparrate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1%</SelectItem>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="10">10%</SelectItem>
                  <SelectItem value="15">15%</SelectItem>
                  <SelectItem value="20">20%</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TypographyH4>Vermögen heute</TypographyH4>
            <InfoTooltip content="Geben Sie Ihr aktuelles Vermögen ein" />
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="currentWealth">Wie hoch ist Ihr Vermögen heute (€)</Label>
              <Input
                id="currentWealth"
                placeholder="z.B. 50000"
                value={wealth}
                onChange={(e) => setWealth(e.target.value)}
                type="number"
                min={0}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TypographyH4>(zukünftiges) Erbe</TypographyH4>
            <InfoTooltip content="Geben Sie Details zu erwarteten Erbschaften ein" />
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="inheritanceAge">Alter bei Erbschaft</Label>
              <Input
                id="inheritanceAge"
                placeholder="z.B. 40"
                value={inheritanceAge}
                onChange={(e) => setInheritanceAge(e.target.value)}
                type="number"
                min={0}
                max={120}
                className="w-full"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="inheritanceAmount">Erbschaftsbetrag (€)</Label>
              <Input
                id="inheritanceAmount"
                placeholder="z.B. 100000"
                value={inheritanceAmount}
                onChange={(e) => setInheritanceAmount(e.target.value)}
                type="number"
                min={0}
                className="w-full"
              />
            </div>
            <div className="flex flex-col space-y-1.5 md:col-span-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="inheritanceTaxClass">Erbschaftssteuerklasse</Label>
                <InfoTooltip content="Die Steuerklasse bestimmt den Steuersatz für Ihre Erbschaft" />
              </div>
              {/* <Select
                value={inheritanceTaxClass}
                onValueChange={(value: "1" | "2" | "3") => setInheritanceTaxClass(value)}
              >
                <SelectTrigger id="inheritanceTaxClass" className="w-full">
                  <SelectValue placeholder="Wählen Sie eine Steuerklasse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Klasse I</SelectItem>
                  <SelectItem value="2">Klasse II</SelectItem>
                  <SelectItem value="3">Klasse III</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TypographyH4>Ausgaben</TypographyH4>
            <InfoTooltip content="Jährliche Ausgaben aus dem Vermögen" />
          </div>
          <Separator />
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="spending">Jährliche Ausgaben aus dem Vermögen (€) (falls sie aus ihrem Vermögen leben)</Label>
            <Input
              id="spending"
              placeholder="z.B. 30000"
              value={spending}
              onChange={(e) => setSpending(e.target.value || "0")}
              type="number"
              min={0}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <Button onClick={handleCalculation} className="bg-primary hover:bg-primary/90">
            Lebenseinkommen - Übersicht erstellen
          </Button>
          {persona && (
            <Button onClick={savePersona} variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Speichern
            </Button>
          )}
        </div>
      </div>

      {showYearlyBreakdown && (
        <div className="mt-8">
          <YearlyBreakdown
            results={yearlyResults}
            onResultsUpdate={handleYearlyResultsUpdate}
            editable={true}
          />
        </div>
      )}
    </>
  )
}


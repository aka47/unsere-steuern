"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Persona, initialPersonas } from "@/types/persona"
import { useLifeIncomeCalculator } from "@/hooks/useLifeIncomeCalculator"
import { INHERITANCE_TAX_CLASSES } from "@/constants/tax"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"
import { type LifeIncomeResults } from "@/types/life-income"
import { TypographyH3, TypographyP, TypographySmall, TypographyMuted } from "@/components/ui/typography"

interface LifeIncomeCalculatorProps {
  setResults: React.Dispatch<React.SetStateAction<LifeIncomeResults>>
  selectedPersona: Persona | null
  setSelectedPersona: (persona: Persona | null) => void
}

const validateInheritanceTaxClass = (value: string): keyof typeof INHERITANCE_TAX_CLASSES => {
  const validClasses = ["1", "2", "3"] as const
  const taxClass = validClasses.find(v => v === value) ?? "1"
  return taxClass as unknown as keyof typeof INHERITANCE_TAX_CLASSES
}

export function LifeIncomeCalculator({ setResults, selectedPersona, setSelectedPersona }: LifeIncomeCalculatorProps) {
  const [currentIncome, setCurrentIncome] = useState("")
  const [currentAge, setCurrentAge] = useState("")
  const [savingsRate, setSavingsRate] = useState("")
  const [inheritanceAge, setInheritanceAge] = useState("")
  const [inheritanceAmount, setInheritanceAmount] = useState("")
  const [inheritanceTaxClass, setInheritanceTaxClass] = useState<"1" | "2" | "3">("1")
  const [spending, setSpending] = useState("")
  const [personas, setPersonas] = useState(initialPersonas)
  const { calculateLifeIncome } = useLifeIncomeCalculator()

  useEffect(() => {
    if (selectedPersona) {
      setCurrentIncome(selectedPersona.currentIncome.toString())
      setCurrentAge(selectedPersona.currentAge.toString())
      setSavingsRate((selectedPersona.savingsRate * 100).toString())
      setInheritanceAge(selectedPersona.inheritanceAge?.toString() ?? "")
      setInheritanceAmount(selectedPersona.inheritanceAmount.toString())
      setSpending(selectedPersona.yearlySpendingFromWealth.toString())
    }
  }, [selectedPersona])

  const handleCalculation = () => {
    if (!selectedPersona) {
      alert("Bitte wählen Sie eine Persona aus oder geben Sie Ihre Daten ein.")
      return
    }

    const parsedValues = {
      currentIncome: Number.parseFloat(currentIncome),
      currentAge: Number.parseInt(currentAge, 10),
      savingsRate: Number.parseFloat(savingsRate) / 100,
      inheritanceAge: inheritanceAge ? Number.parseInt(inheritanceAge, 10) : undefined,
      inheritanceAmount: Number.parseFloat(inheritanceAmount),
      yearlySpendingFromWealth: Number.parseFloat(spending),
      inheritanceTaxClass: validateInheritanceTaxClass(inheritanceTaxClass)
    }

    if (
      Number.isNaN(parsedValues.currentIncome) ||
      Number.isNaN(parsedValues.currentAge) ||
      Number.isNaN(parsedValues.savingsRate) ||
      (inheritanceAge && Number.isNaN(parsedValues.inheritanceAge)) ||
      Number.isNaN(parsedValues.inheritanceAmount) ||
      Number.isNaN(parsedValues.yearlySpendingFromWealth)
    ) {
      alert("Bitte geben Sie gültige Zahlen ein.")
      return
    }

    const results = calculateLifeIncome({
      ...selectedPersona,
      ...parsedValues,
      selectedPersona
    })

    if (!results) {
      alert("Bitte geben Sie gültige Werte ein. Das Alter muss zwischen 20 und 65 liegen.")
      return
    }

    const { details, totals } = results
    setResults(details)
    localStorage.setItem("lifeIncomeResults", JSON.stringify(details))

    if (totals) {
      console.log({
        totalIncome: totals.totalIncome,
        totalTaxes: totals.totalIncomeTax,
        finalWealth: totals.totalWealth
      })
    }
  }

  const handlePersonaChange = (personaId: string) => {
    const persona = personas.find((p) => p.id === personaId) ?? null
    setSelectedPersona(persona)
  }

  const savePersona = () => {
    if (!selectedPersona) return

    const updatedPersona: Persona = {
      ...selectedPersona,
      currentIncome: Number.parseFloat(currentIncome),
      currentAge: Number.parseInt(currentAge, 10),
      savingsRate: Number.parseFloat(savingsRate) / 100,
      inheritanceAge: inheritanceAge ? Number.parseInt(inheritanceAge, 10) : undefined,
      inheritanceAmount: Number.parseFloat(inheritanceAmount),
      yearlySpendingFromWealth: Number.parseFloat(spending)
    }

    const updatedPersonas = personas.map((p) => (p.id === updatedPersona.id ? updatedPersona : p))
    setPersonas(updatedPersonas)
    localStorage.setItem("personas", JSON.stringify(updatedPersonas))
    alert("Persona erfolgreich gespeichert!")
  }

  return (
    <div className="grid w-full items-center gap-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="persona" className="text-base font-medium">Persona</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <TypographyP>Wählen Sie eine vordefinierte Persona oder erstellen Sie Ihre eigene</TypographyP>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={selectedPersona?.id ?? ""} onValueChange={handlePersonaChange}>
          <SelectTrigger id="persona" className="w-full">
            <SelectValue placeholder="Wählen Sie eine Persona" />
          </SelectTrigger>
          <SelectContent>
            {personas.map((persona) => (
              <SelectItem key={persona.id} value={persona.id}>
                {persona.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative my-2 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          oder geben Sie Ihre Daten ein
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TypographyH3>Einkommen</TypographyH3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <TypographyP>Geben Sie Ihr aktuelles Einkommen und Alter ein</TypographyP>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <TypographyP>Der monatliche Betrag, den Sie vom Einkommen sparen</TypographyP>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select value={savingsRate} onValueChange={setSavingsRate}>
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
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TypographyH3>Erbe</TypographyH3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <TypographyP>Geben Sie Details zu erwarteten Erbschaften ein</TypographyP>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <TypographyP>Die Steuerklasse bestimmt den Steuersatz für Ihre Erbschaft</TypographyP>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
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
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TypographyH3>Ausgaben</TypographyH3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <TypographyP>Jährliche Ausgaben aus dem Vermögen</TypographyP>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Separator />
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="spending">Jährliche Ausgaben (€)</Label>
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
          Berechnen
        </Button>
        {selectedPersona && (
          <Button onClick={savePersona} variant="outline" className="border-primary text-primary hover:bg-primary/10">
            Persona Speichern
          </Button>
        )}
      </div>
    </div>
  )
}


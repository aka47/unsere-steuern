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

interface LifeIncomeCalculatorProps {
  setResults: React.Dispatch<
    React.SetStateAction<
      | {
          age: number
          income: number
          incomeTax: number
          wealth: number
          wealthCreatedThisYear: number
          inheritance: number
          inheritanceTax: number
          vat: number
          spending: number
        }[]
      | null
    >
  >
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
  const [inheritanceTaxClass, setInheritanceTaxClass] = useState("1")
  const [spending, setSpending] = useState("")
  const [personas, setPersonas] = useState(initialPersonas)
  const { calculateLifeIncome } = useLifeIncomeCalculator()

  useEffect(() => {
    if (selectedPersona) {
      setCurrentIncome(selectedPersona.currentIncome.toString())
      setCurrentAge(selectedPersona.initialAge.toString())
      setSavingsRate((selectedPersona.savingsRate * 100).toString())
      setInheritanceAge(selectedPersona.inheritanceAge?.toString() || "")
      setInheritanceAmount(selectedPersona.inheritanceAmount.toString())
      setSpending(selectedPersona.spending.toString())
    }
  }, [selectedPersona])

  const handleCalculation = () => {
    debugger
    const results = calculateLifeIncome({
      currentIncome: Number.parseFloat(currentIncome),
      currentAge: Number.parseInt(currentAge),
      savingsRate: Number.parseFloat(savingsRate) / 100,
      inheritanceAge: inheritanceAge ? Number.parseInt(inheritanceAge) : undefined,
      inheritanceAmount: Number.parseFloat(inheritanceAmount),
      inheritanceTaxClass: validateInheritanceTaxClass(inheritanceTaxClass),
      vatRate: 19,
      vatApplicableRate: 70,
      yearlySpendingFromWealth: Number.parseInt(spending),
      selectedPersona,
    })

    if (!results) {
      alert(
        "Bitte geben Sie gültige Werte ein. Das Alter muss zwischen 20 und 65 liegen." + results,
      )
      return
    }

    const { details, totals } = results
    setResults(details)
    localStorage.setItem("lifeIncomeResults", JSON.stringify(details))

    if (totals) {
      console.log("Total Income:", totals.totalIncome)
      console.log("Total Taxes:", totals.totalIncomeTax)
      console.log("Final Wealth:", totals.totalWealth)
    }
  }

  const handlePersonaChange = (personaId: string) => {
    const persona = personas.find((p) => p.id === personaId) || null
    setSelectedPersona(persona)
  }

  const savePersona = () => {
    if (selectedPersona) {
      const updatedPersona: Persona = {
        ...selectedPersona,
        currentIncome: Number.parseFloat(currentIncome),
        initialAge: Number.parseInt(currentAge),
        savingsRate: Number.parseFloat(savingsRate) / 100,
        inheritanceAge: inheritanceAge ? Number.parseInt(inheritanceAge) : null,
        inheritanceAmount: Number.parseFloat(inheritanceAmount),
        spending: Number.parseFloat(spending),
      }
      const updatedPersonas = personas.map((p) => (p.id === updatedPersona.id ? updatedPersona : p))
      setPersonas(updatedPersonas)
      localStorage.setItem("personas", JSON.stringify(updatedPersonas))
      alert("Persona updated successfully!")
    }
  }

  return (
    <Card className="max-w-2xl mxs-auto">
      <CardHeader>
        <CardTitle>Lebenseinkommen Rechner</CardTitle>
        <CardDescription>
          Geben Sie Ihre Daten ein, um Ihr Lebenseinkommen, Vermögen und Steuern zu berechnen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="persona">Persona</Label>
            <Select value={selectedPersona?.id || ""} onValueChange={handlePersonaChange}>
              <SelectTrigger>
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
          <div className="relative my-4 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              oder geben Sie Ihre Daten ein
            </span>
          </div>
          <h3 className="font-semibold mb-2">Einkommen</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="currentIncome">Aktuelles Jahreseinkommen (€)</Label>
              <Input
                id="currentIncome"
                placeholder="z.B. 50000"
                value={currentIncome}
                onChange={(e) => setCurrentIncome(e.target.value)}
                type="number"
                min={0}
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
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="savingsRate">Sparrate (%)</Label>
              <Select value={savingsRate} onValueChange={setSavingsRate}>
                <SelectTrigger>
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
              <p className="text-sm text-muted-foreground mt-1">Der monatliche Betrag, den Sie vom Einkommen sparen</p>
            </div>
          </div>


          <div className="space-y-4 mt-4">
            <h3 className="font-semibold">Erbe</h3>
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
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="inheritanceTaxClass">Erbschaftssteuerklasse</Label>
              <Select value={inheritanceTaxClass} onValueChange={setInheritanceTaxClass}>
                <SelectTrigger>
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
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="spending">Jährliche Ausgaben (€)</Label>
            <Input
              id="spending"
              placeholder="z.B. 30000"
              value={spending}
              onChange={(e) => setSpending(e.target.value || "0")}
              type="number"
              min={0}
              defaultValue={0}
            />
            <p className="text-sm text-muted-foreground mt-1">Jährliche Ausgaben aus dem Vermögen</p>
          </div>
          <div className="mt-2"></div>

          <Button onClick={handleCalculation}>Berechnen</Button>
          {selectedPersona && <Button onClick={savePersona}>Persona Speichern</Button>}
        </div>
      </CardContent>
    </Card>
  )
}


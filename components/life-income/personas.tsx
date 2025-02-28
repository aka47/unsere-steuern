import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLifeIncomeCalculator } from "@/hooks/useLifeIncomeCalculator"

// Konstanten für unsere Berechnungen
const WORK_YEARS = 45

// Definition unserer 10 Personas (Dezile)
const personas = [
  {
    decile: 1,
    annualIncome: 25000,
    savingsRate: 0.05,
    inheritanceChance: 0.05,
    typicalInheritance: 0,
  },
  {
    decile: 2,
    annualIncome: 30000,
    savingsRate: 0.06,
    inheritanceChance: 0.1,
    typicalInheritance: 5000,
  },
  {
    decile: 3,
    annualIncome: 35000,
    savingsRate: 0.07,
    inheritanceChance: 0.1,
    typicalInheritance: 10000,
  },
  {
    decile: 4,
    annualIncome: 40000,
    savingsRate: 0.08,
    inheritanceChance: 0.12,
    typicalInheritance: 20000,
  },
  {
    decile: 5,
    annualIncome: 45000,
    savingsRate: 0.1,
    inheritanceChance: 0.17,
    typicalInheritance: 30000,
  },
  {
    decile: 6,
    annualIncome: 50000,
    savingsRate: 0.12,
    inheritanceChance: 0.22,
    typicalInheritance: 40000,
  },
  {
    decile: 7,
    annualIncome: 55000,
    savingsRate: 0.15,
    inheritanceChance: 0.3,
    typicalInheritance: 50000,
  },
  {
    decile: 8,
    annualIncome: 60000,
    savingsRate: 0.18,
    inheritanceChance: 0.42,
    typicalInheritance: 75000,
  },
  {
    decile: 9,
    annualIncome: 70000,
    savingsRate: 0.22,
    inheritanceChance: 0.55,
    typicalInheritance: 100000,
  },
  {
    decile: 10,
    annualIncome: 90000,
    savingsRate: 0.25,
    inheritanceChance: 0.65,
    typicalInheritance: 150000,
  },
]

// Aktualisierung des Berechnungsteils in calculatedPersonas
const calculatedPersonas = personas.map((persona) => {
  const { calculateLifeIncome } = useLifeIncomeCalculator()

  const results = calculateLifeIncome({
    ...persona,
    currentIncome: persona.annualIncome,
    yearlySpendingFromWealth: persona.annualIncome * (1 - persona.savingsRate),
    currentAge: 20,
    initialAge: 20,
    inheritanceAge: persona.inheritanceChance > 0 ? 40 : 0,
    inheritanceAmount: persona.typicalInheritance,
    inheritanceTaxClass: 1 as const,
    vatRate: 19,
    vatApplicableRate: 80,
    currentIncomeFromWealth: 0,
    currentWealth: 0,
    // incomeGrowth: (age: number) => (age <= 45 ? 1.02 : 1.0),
  })

  if (!results) return null

  const { totals } = results
  const expectedInheritance = persona.inheritanceChance * persona.typicalInheritance

  return {
    decile: `Dezil ${persona.decile}`,
    annualIncome: persona.annualIncome,
    lifetimeIncome: totals.totalIncome,
    annualVAT: Number.parseFloat((totals.totalVAT / WORK_YEARS).toFixed(2)),
    lifetimeVAT: totals.totalVAT,
    annualIncomeTax: Number.parseFloat((totals.totalIncomeTax / WORK_YEARS).toFixed(2)),
    lifetimeIncomeTax: totals.totalIncomeTax,
    annualSavings: Number.parseFloat((totals.totalWealth / WORK_YEARS).toFixed(2)),
    lifetimeSavings: totals.totalWealth,
    expectedInheritance: Number.parseFloat(expectedInheritance.toFixed(2)),
    inheritanceTax: totals.totalInheritanceTax,
  }
}).filter(Boolean)

// Für den Tooltip-Formatierer
function formatValue(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
  }).format(numValue)
}

function Personas() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Finanzübersicht der Personas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={600}>
          <BarChart data={calculatedPersonas} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="decile" />
            <YAxis />
            <Tooltip formatter={(value: number | string) => formatValue(value)} />
            <Legend />
            <Bar dataKey="lifetimeIncome" fill="#8884d8" name="Lebenseinkommen" />
            <Bar dataKey="lifetimeVAT" fill="#82ca9d" name="Lebenszeitliche Mehrwertsteuer" />
            <Bar dataKey="lifetimeIncomeTax" fill="#ffc658" name="Lebenszeitliche Einkommensteuer" />
            <Bar dataKey="lifetimeSavings" fill="#ff8042" name="Lebensersparnisse" />
            <Bar dataKey="expectedInheritance" fill="#8dd1e1" name="Erwartetes Erbe" />
            <Bar dataKey="inheritanceTax" fill="#a4de6c" name="Erbschaftssteuer" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default Personas


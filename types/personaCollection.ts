import { Persona, defaultPersona, initialPersonas, avgPersonas, highIncomePersonas, grokPersonas } from "./persona"
import { GrokPersonaBuilder } from "@/lib/personaCollectionBuilder"

export interface PersonaCollection {
  id: string
  title: string
  description: string
  personas: Persona[]
  size: number // Total population size this collection represents
}

// Helper functions for generating persona data
function generateIncome(percentile: number): number {
  const medianIncome = 25000
  const sigma = 0.5
  return Math.round(medianIncome * Math.exp(sigma * percentile))
}

function generateWealth(percentile: number): number {
  const scale = 10000 // Basisvermögen
  const alpha = 1.5 // Ungleichheit
  return Math.round(scale / Math.pow(1 - percentile, 1 / alpha))
}

function generateInheritance(percentile: number): number {
  if (percentile < 0.5) return 0 // Die unteren 50% erben meist nichts
  const inheritanceBase = 10000
  return Math.round(inheritanceBase * Math.pow(percentile, 3)) // Stärker ansteigend für obere Percentiles
}

// Generate 100 personas representing different percentiles
const generate100Personas = (): Persona[] => {
  const personas: Persona[] = []

  for (let i = 1; i <= 100; i++) {
    const percentile = i / 100
    const income = generateIncome(percentile)
    const wealth = generateWealth(percentile)
    const inheritance = generateInheritance(percentile)

    personas.push({
      ...defaultPersona,
      id: `persona_${i}`,
      name: `Persona ${i}`,
      description: `Repräsentiert das ${i}%-Percentil`,
      icon: i > 90 ? "💰" : i > 50 ? "🏠" : "👤",
      initialAge: 20,
      currentAge: 65,
      // currentIncome: income,
      currentIncome: Math.round(30000 * Math.pow(1.05, i)),
      currentIncomeFromWealth: Math.round(5000 * Math.pow(1.08, i)),
      savingsRate: 0.1 + percentile * 0.4, // Von 10% bis 50% Sparrate
      inheritanceAge: inheritance > 0 ? Math.floor(40 + Math.random() * 20) : null,
      inheritanceAmount: inheritance,
      vatApplicableRate: Math.round(50 + percentile * 50), // 50%-100%
      incomeGrowth: 1.02 + percentile * 0.03,
      yearlySpendingFromWealth: Math.round(wealth * (0.01 + percentile * 0.04)) // 1%-5% Ausgabequote
    })
  }
  return personas
}

export const initialPersonasCollection: PersonaCollection = {
  id: "initial-personas",
  title: "Karrierewege und Lebenssituationen",
  description: "Eine Sammlung von Personas, die verschiedene typische Karrierewege und Lebenssituationen darstellen, vom Werkstudenten bis zum Großerben.",
  personas: initialPersonas,
  size: 42e6 // Assuming 42 million households
}

export const avgPersonasCollection: PersonaCollection = {
  id: "avg-personas",
  title: "Einkommensverteilung",
  description: "Repräsentative Personas für verschiedene Einkommensschichten, von Geringverdienern bis zur vermögenden Elite.",
  personas: avgPersonas,
  size: 42e6 // Assuming 42 million households
}

export const grokPersonasCollection: PersonaCollection = {
  id: "grok-personas",
  title: "Grok Einkommensverteilung",
  description: "Repräsentative Personas für verschiedene Einkommensschichten, von Geringverdienern bis zur vermögenden Elite.",
  personas: grokPersonas,
  size: 42e6 // Assuming 42 million households
}

export const highIncomePersonasCollection: PersonaCollection = {
  id: "high-income-personas",
  title: "Hocheinkommensgruppen",
  description: "Detaillierte Darstellung der oberen Einkommens- und Vermögensschichten, von der wohlhabenden Oberschicht bis zu Milliardären.",
  personas: highIncomePersonas,
  size: 42e6 // Assuming 42 million households
}

export const hundredAvgPersonas: PersonaCollection = {
  id: "100-avg-personas",
  title: "100 Durchschnittliche Personas",
  description: "Eine Sammlung von 100 Personas, die das gesamte Spektrum der Einkommens- und Vermögensverteilung repräsentieren, vom 1. bis zum 100. Perzentil.",
  personas: generate100Personas(),
  size: 42e6 // Assuming 42 million households
}

export const allPersonaCollections: PersonaCollection[] = [
  initialPersonasCollection,
  avgPersonasCollection,
  highIncomePersonasCollection,
  hundredAvgPersonas
]

// Distribution configuration for Germany
const germanyConfig = {
  totalWealth: 13000e9, // 13 trillion euros
  totalIncome: 2580e9,  // 2,580 billion euros
  totalInheritance: 400e9, // 400 billion euros annually
  totalHouseholds: 42e6, // 42 million households
  annualDeaths: 1e6     // ~1 million deaths per year
}

// Store the collection in memory
let personaCollection: PersonaCollection | null = null

export function getPersonaCollection(): PersonaCollection {
  // Return cached collection if available
  if (personaCollection) {
    return personaCollection
  }

  // Create new collection if not cached
  const builder = new GrokPersonaBuilder(germanyConfig)
  const personas = builder.buildPersonas()

  personaCollection = {
    id: "grok-100-personas",
    title: "100 Grok Personas",
    description: "Eine statistisch repräsentative Sammlung von 100 Personas, basierend auf der deutschen Einkommens-, Vermögens- und Erbschaftsverteilung.",
    personas,
    size: 42e6 // Assuming 42 million households
  }

  return personaCollection
}

// Function to clear the cache if needed
export function clearPersonaCollection(): void {
  personaCollection = null
}

// Function to validate the collection totals
export function validatePersonaCollectionTotals() {
  if (!personaCollection) {
    getPersonaCollection()
  }

  const builder = new GrokPersonaBuilder(germanyConfig)
  return builder.validateTotals()
}

// Export the config for reference
export const config = germanyConfig

// Export the collection for direct access
export const grok100PersonasCollection = getPersonaCollection()

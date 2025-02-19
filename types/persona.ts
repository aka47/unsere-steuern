export interface Persona {
  id: string
  name: string
  description: string
  icon: string
  initialAge: number
  initialIncome: number
  savingsRate: number
  inheritanceAge: number | null
  inheritanceAmount: number
  incomeGrowth: (age: number) => number
  spending: number
}

export const initialPersonas: Persona[] = [
  {
    id: "ceo",
    name: "Vom Werkstudent zum CEO",
    description: "Beginnt als Werkstudent und steigt durch kontinuierliche Weiterbildung und Engagement zur Führungskraft auf. Mit 50 erfolgt der Sprung in die Geschäftsführung, was zu einem deutlichen Einkommensanstieg führt.",
    icon: "👔",
    initialAge: 20,
    initialIncome: 30000,
    savingsRate: 0.2,
    inheritanceAge: null,
    inheritanceAmount: 0,
    incomeGrowth: (age) => {
      if (age <= 50) return 1.05
      if (age <= 60) return 1.2
      return 1
    },
    spending: 0,
  },
  {
    id: "single-mother",
    name: "Alleinerziehende Mutter",
    description: "Muss Beruf und Kindererziehung vereinbaren, was die Karriereentwicklung erschwert. Trotz der Herausforderungen schafft sie es, durch konstante Arbeit ein stabiles Einkommen aufzubauen.",
    icon: "👩‍👧‍👦",
    initialAge: 25,
    initialIncome: 20000,
    savingsRate: 0.05,
    inheritanceAge: null,
    inheritanceAmount: 0,
    incomeGrowth: () => 1.02,
    spending: 0,
  },
  {
    id: "avg-worker",
    name: "Durchschnittlicher Angestellter",
    description: "Typischer Werdegang eines Angestellten mit Berufsausbildung. Moderate aber stetige Gehaltssteigerungen durch Berufserfahrung und regelmäßige Fortbildungen.",
    icon: "👨‍💼",
    initialAge: 22,
    initialIncome: 35000,
    savingsRate: 0.1,
    inheritanceAge: null,
    inheritanceAmount: 0,
    incomeGrowth: () => 1.03,
    spending: 0,
  },
  {
    id: "manager",
    name: "Manager mit Erbschaft",
    description: "Erfolgreicher Manager, der seine Karriere durch eigene Leistung aufbaut. Mit 50 erhält er eine substanzielle Erbschaft, die sein Vermögen deutlich steigert.",
    icon: "👨‍💼",
    initialAge: 26,
    initialIncome: 50000,
    savingsRate: 0.15,
    inheritanceAge: 50,
    inheritanceAmount: 200000,
    incomeGrowth: (age) => (age <= 45 ? 1.05 : 1.02),
    spending: 0,
  },
  {
    id: "inherited-millionaire",
    name: "Früher Millionenerbe",
    description: "Erbt bereits mit 20 Jahren eine Million Euro. Arbeitet trotzdem in einem normalen Job und lässt das geerbte Vermögen für sich arbeiten.",
    icon: "💰",
    initialAge: 20,
    initialIncome: 30000,
    savingsRate: 0.1,
    inheritanceAge: 20,
    inheritanceAmount: 1000000,
    incomeGrowth: () => 1.02,
    spending: 0,
  },
  {
    id: "trust-fund",
    name: "Großerbe",
    description: "Erbt mit 20 Jahren ein Vermögen von 10 Millionen Euro. Lebt von den Kapitalerträgen ohne eigenes Arbeitseinkommen und gibt jährlich 200.000 Euro aus.",
    icon: "🏖️",
    initialAge: 20,
    initialIncome: 0,
    savingsRate: 0,
    inheritanceAge: 20,
    inheritanceAmount: 10000000,
    incomeGrowth: () => 1,
    spending: 200000,
  },
]


export interface Persona {
  id: string
  name: string
  description: string
  icon: string
  initialAge: number
  currentAge: number
  currentIncome: number
  currentIncomeFromWealth: number
  savingsRate: number
  inheritanceAge: number | undefined
  inheritanceAmount: number
  inheritanceTaxClass: 1 | 2 | 3
  vatRate: number
  vatApplicableRate: number
  incomeGrowth: (age: number) => number
  yearlySpendingFromWealth: number
  currentWealth: number
}

export const defaultPersona: Persona = {
  id: "default",
  name: "Standard Profile",
  description: "Ein durchschnittliches Profil mit typischen Werten",
  icon: "👤",
  initialAge: 20,
  currentAge: 20,
  currentIncome: 30000,
  currentIncomeFromWealth: 0,
  savingsRate: 0,
  inheritanceAge: undefined,
  inheritanceAmount: 0,
  inheritanceTaxClass: 1,
  vatRate: 19,
  vatApplicableRate: 70,
  incomeGrowth: (age) => (age <= 45 ? 1.02 : 1.0),
  yearlySpendingFromWealth: 0,
  currentWealth: 0
}

export const initialPersonas: Persona[] = [
  {
    ...defaultPersona,
    id: "ceo",
    name: "Vom Werkstudent zum CEO",
    description: "Beginnt als Werkstudent und steigt durch kontinuierliche Weiterbildung und Engagement zur Führungskraft auf. Mit 50 erfolgt der Sprung in die Geschäftsführung, was zu einem deutlichen Einkommensanstieg führt.",
    icon: "👔",
    savingsRate: 0.2,
    incomeGrowth: (age) => {
      if (age <= 50) return 1.05
      if (age <= 60) return 1.2
      return 1
    },
  },
  {
    ...defaultPersona,
    id: "single-mother",
    name: "Alleinerziehende Mutter",
    description: "Muss Beruf und Kindererziehung vereinbaren, was die Karriereentwicklung erschwert. Trotz der Herausforderungen schafft sie es, durch konstante Arbeit ein stabiles Einkommen aufzubauen.",
    icon: "👩‍👧‍👦",
    currentIncome: 20000,
    incomeGrowth: (age) => (age <= 40 ? 1.01 : 1.03),
  },
  {
    ...defaultPersona,
    id: "avg-worker",
    name: "Durchschnittlicher Angestellter",
    description: "Typischer Werdegang eines Angestellten mit Berufsausbildung. Moderate aber stetige Gehaltssteigerungen durch Berufserfahrung und regelmäßige Fortbildungen.",
    icon: "👨‍💼",
    savingsRate: 0.05,
  },
  {
    ...defaultPersona,
    id: "manager",
    name: "Manager mit Erbschaft",
    description: "Erfolgreicher Manager, der seine Karriere durch eigene Leistung aufbaut. Mit 50 erhält er eine substanzielle Erbschaft, die sein Vermögen deutlich steigert.",
    icon: "👨‍💼",
    initialAge: 25,
    currentAge: 30,
    currentIncome: 50000,
    savingsRate: 0.15,
    inheritanceAge: 50,
    inheritanceAmount: 200000,
    incomeGrowth: (age) => (age <= 45 ? 1.05 : 1.02),
  },
  {
    ...defaultPersona,
    id: "inherited-millionaire",
    name: "Früher Millionenerbe",
    description: "Erbt bereits mit 20 Jahren eine Million Euro. Arbeitet trotzdem in einem normalen Job und lässt das geerbte Vermögen für sich arbeiten.",
    icon: "💰",
    currentAge: 25,
    inheritanceAge: 20,
    inheritanceAmount: 1000000,
    currentWealth: 1000000,
    incomeGrowth: () => 1.02,
    yearlySpendingFromWealth: 40000,
  },
  {
    ...defaultPersona,
    id: "trust-fund",
    name: "Großerbe",
    description: "Erbt mit 20 Jahren ein Vermögen von 10 Millionen Euro. Lebt von den Kapitalerträgen ohne eigenes Arbeitseinkommen und gibt jährlich 200.000 Euro aus.",
    icon: "🏖️",
    currentAge: 30,
    currentIncome: 0,
    inheritanceAge: 20,
    inheritanceAmount: 10000000,
    currentWealth: 10000000,
    incomeGrowth: () => 1,
    yearlySpendingFromWealth: 200000,
  },
]

export const avgPersonas: Persona[] = [
  {
    id: "persona_1",
    name: "Geringverdiener",
    description: "Gehört zu den unteren 20% der Einkommens- und Vermögensverteilung. Kaum Erbschaft, niedrige Sparrate, begrenztes Einkommen.",
    icon: "🧑‍🔧",
    initialAge: 20,
    currentAge: 65,
    currentIncome: 15000,
    currentIncomeFromWealth: 0,
    savingsRate: 0.05,
    inheritanceAge: 45,
    inheritanceAmount: 5000,
    inheritanceTaxClass: 1,
    vatRate: 19,
    vatApplicableRate: 60,
    incomeGrowth: (age) => (age <= 40 ? 1.01 : 1.005),
    yearlySpendingFromWealth: 0,
    currentWealth: 5000
  },
  {
    id: "persona_2",
    name: "Arbeiterschicht",
    description: "20–40% Einkommens- und Vermögensverteilung. Erhält eine moderate Erbschaft, wächst langsam im Einkommen.",
    icon: "👷",
    initialAge: 20,
    currentAge: 65,
    currentIncome: 25000,
    currentIncomeFromWealth: 500,
    savingsRate: 0.1,
    inheritanceAge: 50,
    inheritanceAmount: 20000,
    inheritanceTaxClass: 1,
    vatRate: 19,
    vatApplicableRate: 65,
    incomeGrowth: (age) => (age <= 45 ? 1.02 : 1.01),
    yearlySpendingFromWealth: 0,
    currentWealth: 20000
  },
  {
    id: "persona_3",
    name: "Mittelschicht",
    description: "40–60% der Einkommens- und Vermögensverteilung. Hat gute Sparmöglichkeiten und erbt eine mittlere Summe.",
    icon: "👨‍💼",
    initialAge: 20,
    currentAge: 65,
    currentIncome: 40000,
    currentIncomeFromWealth: 2000,
    savingsRate: 0.15,
    inheritanceAge: 55,
    inheritanceAmount: 50000,
    inheritanceTaxClass: 1,
    vatRate: 19,
    vatApplicableRate: 70,
    incomeGrowth: (age) => (age <= 50 ? 1.03 : 1.015),
    yearlySpendingFromWealth: 500,
    currentWealth: 50000
  },
  {
    id: "persona_4",
    name: "Obere Mittelschicht",
    description: "60–80% Einkommens- und Vermögensverteilung. Erhält eine signifikante Erbschaft und spart aktiv.",
    icon: "💼",
    initialAge: 20,
    currentAge: 65,
    currentIncome: 70000,
    currentIncomeFromWealth: 10000,
    savingsRate: 0.2,
    inheritanceAge: 60,
    inheritanceAmount: 150000,
    inheritanceTaxClass: 1,
    vatRate: 19,
    vatApplicableRate: 75,
    incomeGrowth: (age) => (age <= 55 ? 1.04 : 1.02),
    yearlySpendingFromWealth: 2000,
    currentWealth: 150000
  },
  {
    id: "persona_5",
    name: "Vermögende Elite",
    description: "80–100% der Einkommens- und Vermögensverteilung. Sehr hohe Erbschaft, starkes Einkommen und Vermögenswachstum.",
    icon: "🏦",
    initialAge: 20,
    currentAge: 65,
    currentIncome: 200000,
    currentIncomeFromWealth: 100000,
    savingsRate: 0.3,
    inheritanceAge: 50,
    inheritanceAmount: 1000000,
    inheritanceTaxClass: 1,
    vatRate: 19,
    vatApplicableRate: 80,
    incomeGrowth: (age) => (age <= 60 ? 1.05 : 1.02),
    yearlySpendingFromWealth: 50000,
    currentWealth: 1000000
  }
]

export const highIncomePersonas: Persona[] = [
  {
    id: "persona_6",
    name: "Wohlhabende Oberschicht",
    description: "80–85% der Einkommens- und Vermögensverteilung. Hohes Einkommen, spart effektiv und erbt eine beträchtliche Summe.",
    icon: "🏠",
    initialAge: 20,
    currentAge: 65,
    currentIncome: 120000,
    currentIncomeFromWealth: 30000, // 25% aus Vermögen
    savingsRate: 0.25,
    inheritanceAge: 55,
    inheritanceAmount: 300000,
    inheritanceTaxClass: 1,
    vatRate: 19,
    vatApplicableRate: 80,
    incomeGrowth: (age) => (age <= 55 ? 1.045 : 1.025),
    yearlySpendingFromWealth: 22500,
    currentWealth: 300000
  },
  {
    id: "persona_7",
    name: "Vermögensverwalter",
    description: "85–90% der Einkommens- und Vermögensverteilung. Sehr hohe Erbschaft, wachsendes Einkommen durch Investitionen.",
    icon: "🏡",
    initialAge: 20,
    currentAge: 65,
    currentIncome: 180000,
    currentIncomeFromWealth: 54000, // 30% aus Vermögen
    savingsRate: 0.28,
    inheritanceAge: 50,
    inheritanceAmount: 500000,
    inheritanceTaxClass: 1,
    vatRate: 19,
    vatApplicableRate: 85,
    incomeGrowth: (age) => (age <= 60 ? 1.05 : 1.03),
    yearlySpendingFromWealth: 50000,
    currentWealth: 500000
  },
  {
    id: "persona_8",
    name: "Top-Verdiener",
    description: "90–95% der Einkommens- und Vermögensverteilung. Sehr hohes Einkommen und erhebliche Vermögenszuwächse.",
    icon: "🏙️",
    initialAge: 20,
    currentAge: 65,
    currentIncome: 300000,
    currentIncomeFromWealth: 120000, // 40% aus Vermögen
    savingsRate: 0.32,
    inheritanceAge: 45,
    inheritanceAmount: 800000,
    inheritanceTaxClass: 1,
    vatRate: 19,
    vatApplicableRate: 90,
    incomeGrowth: (age) => (age <= 60 ? 1.06 : 1.03),
    yearlySpendingFromWealth: 100000,
    currentWealth: 800000
  },
  {
    id: "persona_9",
    name: "Vermögenselite",
    description: "95–99% der Einkommens- und Vermögensverteilung. Extrem hohes Einkommen und Vermögen, erhebliche Erbschaften.",
    icon: "💎",
    initialAge: 20,
    currentAge: 65,
    currentIncome: 500000,
    currentIncomeFromWealth: 250000, // 50% aus Vermögen
    savingsRate: 0.35,
    inheritanceAge: 40,
    inheritanceAmount: 2000000,
    inheritanceTaxClass: 1,
    vatRate: 19,
    vatApplicableRate: 95,
    incomeGrowth: (age) => (age <= 60 ? 1.07 : 1.04),
    yearlySpendingFromWealth: 200000,
    currentWealth: 2000000
  },
  {
    id: "persona_10",
    name: "Superreiche",
    description: "Top 1% der Einkommens- und Vermögensverteilung. Astronomisches Einkommen und Vermögen, lebt primär von Kapitalerträgen.",
    icon: "👑",
    initialAge: 20,
    currentAge: 65,
    currentIncome: 5000000,
    currentIncomeFromWealth: 4000000, // 80% aus Vermögen
    savingsRate: 0.5,
    inheritanceAge: 45,
    inheritanceAmount: 50000000,
    inheritanceTaxClass: 1,
    vatRate: 19,
    vatApplicableRate: 95,
    incomeGrowth: (age) => (age <= 60 ? 1.1 : 1.05),
    yearlySpendingFromWealth: 2000000,
    currentWealth: 5000000
  }
]
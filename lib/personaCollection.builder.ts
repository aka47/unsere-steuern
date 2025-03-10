import { type Persona } from "@/types/persona"
import { type PersonaCollection } from "@/types/personaCollection"

// Define the Persona interface
// interface Persona {
//   id: string;
//   name: string;
//   description: string;
//   icon: string;
//   initialAge: number;
//   currentAge: number;
//   currentIncome: number;
//   currentIncomeFromWealth: number; // Income derived from wealth (e.g., 5-20%)
//   savingsRate: number;
//   inheritanceAge: number;
//   inheritanceAmount: number; // Expected inheritance if received
//   inheritanceTaxClass: 1 | 2 | 3;
//   vatRate: number;
//   vatApplicableRate: number;
//   incomeGrowth: (age: number) => number;
//   yearlySpendingFromWealth: number;
//   currentWealth: number;
// }

// Distribution configuration for Germany
interface DistributionConfig {
  totalWealth: number; // in billion euros
  totalIncome: number; // in billion euros
  totalInheritance: number; // in billion euros annually
  totalHouseholds: number;
  inheritanceRecipientPercentage: number; // e.g., 0.05 (5%)
}

// PersonaBuilder class
class GrokPersonaBuilder {
  private config: DistributionConfig;
  private decileCount: number = 10;
  private personas: Persona[] = [];

  constructor(config: DistributionConfig) {
    this.config = config;
  }

  // Wealth distribution percentages (sum to 100%)
  private wealthDistribution: number[] = [
    0.001,  // Decile 1
    0.005,  // Decile 2
    0.01,   // Decile 3
    0.02,   // Decile 4
    0.03,   // Decile 5
    0.04,   // Decile 6
    0.06,   // Decile 7
    0.08,   // Decile 8
    0.10,   // Decile 9
    0.654   // Decile 10
  ];

  // Income distribution percentages (sum to 100%)
  private incomeDistribution: number[] = [
    0.02,   // Decile 1
    0.03,   // Decile 2
    0.04,   // Decile 3
    0.05,   // Decile 4
    0.06,   // Decile 5
    0.07,   // Decile 6
    0.08,   // Decile 7
    0.09,   // Decile 8
    0.10,   // Decile 9
    0.46    // Decile 10
  ];

  // Inheritance amounts (if received) and probabilities
  private inheritanceAmounts: number[] = [
    10000,  // Decile 1
    20000,  // Decile 2
    30000,  // Decile 3
    40000,  // Decile 4
    50000,  // Decile 5
    75000,  // Decile 6
    100000, // Decile 7
    150000, // Decile 8
    200000, // Decile 9
    500000  // Decile 10
  ];
  private inheritanceProbabilities: number[] = [
    0.01,  // Decile 1
    0.02,  // Decile 2
    0.03,  // Decile 3
    0.04,  // Decile 4
    0.05,  // Decile 5
    0.06,  // Decile 6
    0.07,  // Decile 7
    0.08,  // Decile 8
    0.09,  // Decile 9
    0.10   // Decile 10
  ];

  // Names and descriptions for personas
  private names: string[] = [
    "Geringverdiener im Ruhestand",
    "Bescheidener Verdiener",
    "Untere Mittelschicht",
    "Durchschnittsverdiener",
    "Gehobene Mittelschicht",
    "Gutverdiener",
    "Besserverdiener",
    "Wohlhabender Berufstätiger",
    "Vermögender Investor",
    "Spitzenvermögensinhaber"
  ];
  private descriptions: string[] = [
    "Untere 10% Vermögen, minimale Ersparnisse, niedriges Einkommen hauptsächlich aus Arbeit.",
    "10-20% Vermögen, bescheidenes Einkommen mit kleinem Vermögensbeitrag.",
    "20-30% Vermögen, moderates Einkommen mit wachsenden Ersparnissen.",
    "30-40% Vermögen, stabiles Einkommen mit moderatem Vermögen.",
    "40-50% Vermögen, überdurchschnittliches Einkommen mit soliden Ersparnissen.",
    "50-60% Vermögen, hohes Einkommen mit bemerkenswertem Vermögenseinkommen.",
    "60-70% Vermögen, sehr hohes Einkommen mit beträchtlichem Vermögen.",
    "70-80% Vermögen, Spitzeneinkommen mit signifikantem Vermögenseinkommen.",
    "80-90% Vermögen, sehr hohes Einkommen mit großem Vermögenseinkommen.",
    "Top 10% Vermögen, extrem hohes Einkommen mit bedeutendem Vermögenseinkommen."
  ];

  // Build personas
  public buildPersonas(): Persona[] {
    const householdsPerDecile = this.config.totalHouseholds / this.decileCount;

    for (let i = 0; i < this.decileCount; i++) {
      // Wealth calculation
      const totalWealthInDecile = this.config.totalWealth * this.wealthDistribution[i];
      const currentWealth = Math.round(totalWealthInDecile / householdsPerDecile);

      // Income calculation
      const totalIncomeInDecile = this.config.totalIncome * this.incomeDistribution[i];
      const currentIncome = Math.round(totalIncomeInDecile / householdsPerDecile);

      // Income from wealth (assumed 5% return for lower deciles, up to 10% for higher)
      const wealthReturnRate = 0.05 + (i * 0.005); // 5% to 10%
      const currentIncomeFromWealth = Math.round(currentWealth * wealthReturnRate);

      // Inheritance calculation (expected value)
      const inheritanceAmount = this.inheritanceAmounts[i];
      const inheritanceProbability = this.inheritanceProbabilities[i];
      const expectedInheritance = Math.round(inheritanceAmount * inheritanceProbability);

      // Savings rate (increases with decile)
      const savingsRate = 0.05 + (i * 0.01); // 5% to 15%

      // Spending from wealth (assume 5% of wealth)
      const yearlySpendingFromWealth = Math.round(currentWealth * 0.05);

      // Inheritance age (55 for lower half, 45-50 for upper half)
      const inheritanceAge = i < 5 ? 55 : 50 - (i - 5);

      const persona: Persona = {
        id: `p${i + 1}`,
        name: this.names[i],
        description: this.descriptions[i],
        icon: "👤",
        initialAge: 25,
        currentAge: 60,
        currentIncome,
        currentIncomeFromWealth,
        savingsRate,
        inheritanceAge,
        inheritanceAmount: expectedInheritance,
        inheritanceTaxClass: 1,
        vatRate: 0,
        vatApplicableRate: 0,
        incomeGrowth: 1.02,
        yearlySpendingFromWealth,
        currentWealth
      };

      this.personas.push(persona);
    }

    return this.personas;
  }

  // Validate totals
  public validateTotals(): { wealth: number; income: number; inheritance: number } {
    const householdsPerDecile = this.config.totalHouseholds / this.decileCount;
    const totalWealth = this.personas.reduce((sum, p) => sum + p.currentWealth * householdsPerDecile, 0);
    const totalIncome = this.personas.reduce((sum, p) => sum + p.currentIncome * householdsPerDecile, 0);
    const totalInheritance = this.personas.reduce(
      (sum, p) => sum + p.inheritanceAmount * householdsPerDecile * this.config.inheritanceRecipientPercentage,
      0
    );

    return {
      wealth: totalWealth,
      income: totalIncome,
      inheritance: totalInheritance
    };
  }
}

// Usage
const germanyConfig: DistributionConfig = {
  totalWealth: 13000e9, // 13 trillion euros
  totalIncome: 2580e9,  // 2,580 billion euros
  totalInheritance: 400e9, // 400 billion euros annually
  totalHouseholds: 42e6, // 42 million households
  inheritanceRecipientPercentage: 0.99 // 5% receive inheritance annually
};

const builder = new GrokPersonaBuilder(germanyConfig);
const personas = builder.buildPersonas();
console.log("Generated Personas:", personas);

// Validate totals
const totals = builder.validateTotals();
console.log("Calculated Totals (in billion euros):", {
  wealth: totals.wealth / 1e9,
  income: totals.income / 1e9,
  inheritance: totals.inheritance / 1e9
});
console.log("Expected Totals (in billion euros):", {
  wealth: germanyConfig.totalWealth / 1e9,
  income: germanyConfig.totalIncome / 1e9,
  inheritance: germanyConfig.totalInheritance / 1e9
});








export class PersonaCollectionBuilder {
  private id: string = ""
  private title: string = ""
  private description: string = ""
  private personas: Persona[] = []

  setId(id: string): PersonaCollectionBuilder {
    this.id = id
    return this
  }

  setTitle(title: string): PersonaCollectionBuilder {
    this.title = title
    return this
  }

  setDescription(description: string): PersonaCollectionBuilder {
    this.description = description
    return this
  }

  addPersona(persona: Persona): PersonaCollectionBuilder {
    this.personas.push(persona)
    return this
  }

  addPersonas(personas: Persona[]): PersonaCollectionBuilder {
    this.personas.push(...personas)
    return this
  }

  build(): PersonaCollection {
    if (!this.title) {
      throw new Error("Title is required for PersonaCollection")
    }

    if (!this.id) {
      this.id = crypto.randomUUID()
    }

    return {
      id: this.id,
      title: this.title,
      description: this.description,
      personas: this.personas
    }
  }

  // Predefined collections
  static createDefaultCollection(): PersonaCollection {
    return new PersonaCollectionBuilder()
      .setId("default")
      .setTitle("Standard Personas")
      .setDescription("Eine Sammlung von typischen Lebensläufen")
      .build()
  }

  static createAgeBasedCollection(personas: Persona[]): PersonaCollection {
    return new PersonaCollectionBuilder()
      .setId("by-age")
      .setTitle("Nach Alter")
      .setDescription("Personas gruppiert nach Altersgruppen")
      .addPersonas(personas.sort((a, b) => a.currentAge - b.currentAge))
      .build()
  }

  static createIncomeBasedCollection(personas: Persona[]): PersonaCollection {
    return new PersonaCollectionBuilder()
      .setId("by-income")
      .setTitle("Nach Einkommen")
      .setDescription("Personas gruppiert nach Einkommenshöhe")
      .addPersonas(personas.sort((a, b) => a.currentIncome - b.currentIncome))
      .build()
  }
}
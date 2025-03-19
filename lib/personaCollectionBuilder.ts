import { type Persona } from "@/types/persona"

// Distribution configuration for Germany
interface DistributionConfig {
  totalWealth: number;
  totalIncome: number;
  totalInheritance: number;
  totalHouseholds: number;
  annualDeaths: number;
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
    0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.06, 0.08, 0.10, 0.654
  ];

  // Income distribution percentages (sum to 100%)
  private incomeDistribution: number[] = [
    0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.46
    // 0.002, 0.004, 0.006, 0.008, 0.01, 0.02, 0.03, 0.05, 0.10, 0.77
  ];



  // Inheritance distribution percentages (sum to 100%)
  private inheritanceDistribution: number[] = [
    // 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.13, 0.45 // Top 10% gets 45%
    0.002, 0.004, 0.006, 0.008, 0.01, 0.02, 0.03, 0.05, 0.10, 0.77
  ];

  // Asset class distribution for total inheritance
  private totalAssetDistribution = {
    housing: 0.50,    // 200 billion euros
    company: 0.20,    // 80 billion euros
    financial: 0.30   // 120 billion euros
  };

  // Company assets distribution: 90% to Decile 10, 10% to Deciles 6-9
  private companyAssetDistribution: number[] = [
    0, 0, 0, 0, 0, 0.025, 0.025, 0.025, 0.025, 0.90
  ];

  // Tax exemptions and rates
  private taxExemptionClass1 = 400000; // Per inheritance event
  private companyTaxExemptionRate = 0.95; // 85% exempt for company assets
  private hardshipExemptionThreshold = 1900000; // >1.9M euros qualifies
  private hardshipExemptionRate = 0.6; // 60% of taxable amount exempt for Decile 10
  private taxRates = [
    { limit: 75000, rate: 0.07 },
    { limit: 225000, rate: 0.11 },
    { limit: 500000, rate: 0.15 },
    { limit: 1000000, rate: 0.19 },
    { limit: Infinity, rate: 0.30 }
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
    "Untere 10% Vermögen, minimale Ersparnisse.",
    "10-20% Vermögen, bescheidenes Einkommen.",
    "20-30% Vermögen, moderates Einkommen.",
    "30-40% Vermögen, stabiles Einkommen.",
    "40-50% Vermögen, überdurchschnittliches Einkommen.",
    "50-60% Vermögen, hohes Einkommen.",
    "60-70% Vermögen, sehr hohes Einkommen.",
    "70-80% Vermögen, Spitzeneinkommen.",
    "80-90% Vermögen, sehr hohes Einkommen.",
    "Top 10% Vermögen, extrem hohes Einkommen."
  ];

  // Calculate inheritance tax
  private calculateInheritanceTax(inheritanceTaxableHousingFinancial: number, inheritanceTaxableCompany: number, inheritanceHardship: boolean): number {
    let totalTaxable = inheritanceTaxableHousingFinancial + inheritanceTaxableCompany;
    if (inheritanceHardship && totalTaxable > this.hardshipExemptionThreshold) {
      totalTaxable *= (1 - this.hardshipExemptionRate); // 75% exempt
    }
    let tax = 0;
    let remaining = totalTaxable;

    for (const tier of this.taxRates) {
      if (remaining <= 0) break;
      const prevLimit = this.taxRates.indexOf(tier) === 0 ? 0 : this.taxRates[this.taxRates.indexOf(tier) - 1].limit;
      const taxableInTier = Math.min(remaining, tier.limit - prevLimit);
      tax += taxableInTier * tier.rate;
      remaining -= taxableInTier;
    }

    return Math.round(tax);
  }

  // Build personas
  public buildPersonas(): Persona[] {
    const estatesPerDecile = this.config.annualDeaths / this.decileCount;
    const totalCompanyInheritance = this.config.totalInheritance * this.totalAssetDistribution.company;

    for (let i = 0; i < this.decileCount; i++) {
      // Wealth and income (per household)
      const householdsPerDecile = this.config.totalHouseholds / this.decileCount;
      const totalWealthInDecile = this.config.totalWealth * this.wealthDistribution[i];
      const currentWealth = Math.round(totalWealthInDecile / householdsPerDecile);

      const totalIncomeInDecile = this.config.totalIncome * this.incomeDistribution[i];
      const currentIncome = Math.round(totalIncomeInDecile / householdsPerDecile);

      const wealthReturnRate = 0.05 + (i * 0.005);
      const currentIncomeFromWealth = Math.round(currentWealth * wealthReturnRate);

      // Inheritance (per estate)
      const totalInheritanceInDecile = this.config.totalInheritance * this.inheritanceDistribution[i];
      const inheritanceAmount = Math.round(totalInheritanceInDecile / estatesPerDecile);

      const companyInheritanceInDecile = totalCompanyInheritance * this.companyAssetDistribution[i];
      const inheritanceCompany = Math.round(companyInheritanceInDecile / estatesPerDecile);

      const remainingInheritance = inheritanceAmount - inheritanceCompany;
      const housingProportion = this.totalAssetDistribution.housing / (this.totalAssetDistribution.housing + this.totalAssetDistribution.financial);
      const inheritanceHousing = Math.round(remainingInheritance * housingProportion);
      const inheritanceFinancial = Math.round(remainingInheritance * (1 - housingProportion));

      // Taxable inheritance
      const companyExemption = (i === 9) ? 1.0 : this.companyTaxExemptionRate;
      const inheritanceTaxableCompany = Math.max(0, inheritanceCompany * (1 - companyExemption));
      const inheritanceTaxableHousingFinancial = Math.max(0, (inheritanceHousing + inheritanceFinancial) - this.taxExemptionClass1);
      const inheritanceTaxable = inheritanceTaxableHousingFinancial + inheritanceTaxableCompany;
      const inheritanceTax = this.calculateInheritanceTax(inheritanceTaxableHousingFinancial, inheritanceTaxableCompany, i === 9); // Hardship for Decile 10

      const savingsRate = 0.05 + (i * 0.01);
      const yearlySpendingFromWealth = Math.round(currentWealth * 0.05);
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
        inheritanceAmount,
        inheritanceTaxClass: 1,
        vatRate: 0,
        vatApplicableRate: 0,
        incomeGrowth: 1.02,
        yearlySpendingFromWealth,
        currentWealth,
        inheritanceHousing,
        inheritanceCompany,
        inheritanceFinancial,
        inheritanceTaxable,
        inheritanceTax,
        examples: [],
        examples_summary: ""
      };
      this.personas.push(persona);
    }

    return this.personas;
  }

  // Validate totals
  public validateTotals(): { wealth: number; income: number; inheritance: number; tax: number; housing: number; company: number; financial: number } {
    const estatesPerDecile = this.config.annualDeaths / this.decileCount;
    const householdsPerDecile = this.config.totalHouseholds / this.decileCount;
    const totalWealth = this.personas.reduce((sum, p) => sum + p.currentWealth * householdsPerDecile, 0);
    const totalIncome = this.personas.reduce((sum, p) => sum + p.currentIncome * householdsPerDecile, 0);
    const totalInheritance = this.personas.reduce(
      (sum, p) => sum + p.inheritanceAmount * estatesPerDecile,
      0
    );
    const totalTax = this.personas.reduce(
      (sum, p) => sum + p.inheritanceTax * estatesPerDecile,
      0
    );
    const totalHousing = this.personas.reduce(
      (sum, p) => sum + p.inheritanceHousing * estatesPerDecile,
      0
    );
    const totalCompany = this.personas.reduce(
      (sum, p) => sum + p.inheritanceCompany * estatesPerDecile,
      0
    );
    const totalFinancial = this.personas.reduce(
      (sum, p) => sum + p.inheritanceFinancial * estatesPerDecile,
      0
    );

    return {
      wealth: totalWealth,
      income: totalIncome,
      inheritance: totalInheritance,
      tax: totalTax,
      housing: totalHousing,
      company: totalCompany,
      financial: totalFinancial
    };
  }
}

// Usage
const germanyConfig: DistributionConfig = {
  totalWealth: 13000e9, // 13 trillion euros
  totalIncome: 2580e9,  // 2,580 billion euros
  totalInheritance: 400e9, // 400 billion euros annually
  totalHouseholds: 42e6, // 42 million households
  annualDeaths: 1e6     // ~1 million deaths per year
};

const builder = new GrokPersonaBuilder(germanyConfig);
const personas = builder.buildPersonas();
console.log("Generated Personas:", personas);

// Validate totals
const totals = builder.validateTotals();
console.log("Calculated Totals (in billion euros):", {
  wealth: totals.wealth / 1e9,
  income: totals.income / 1e9,
  inheritance: totals.inheritance / 1e9,
  tax: totals.tax / 1e9,
  housing: totals.housing / 1e9,
  company: totals.company / 1e9,
  financial: totals.financial / 1e9
});
console.log("Expected Totals (in billion euros):", {
  wealth: germanyConfig.totalWealth / 1e9,
  income: germanyConfig.totalIncome / 1e9,
  inheritance: germanyConfig.totalInheritance / 1e9,
  tax: 11,
  housing: germanyConfig.totalInheritance * 0.50 / 1e9,
  company: germanyConfig.totalInheritance * 0.20 / 1e9,
  financial: germanyConfig.totalInheritance * 0.30 / 1e9
});

export function buildPersonaCollection(personas: Persona[]) {
  return personas
}
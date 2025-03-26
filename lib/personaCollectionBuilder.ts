import { defaultPersona, type Persona } from "@/types/persona"

// Distribution configuration for Germany
interface DistributionConfig {
  totalWealth: number;
  totalIncome: number;
  totalInheritance: number;
  totalHouseholds: number;
  annualDeaths: number;
}

// PersonaBuilder class
export class GrokPersonaBuilder {
  private config: DistributionConfig;
  private decileCount: number = 100;
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


  // Wealth distribution breakdown for 90–100% (sums to 1.0 within the decile)
// const wealthDistributionTopDecile: number[] = [
//   0.20,    // 90–95%
//   0.25,    // 95–99%
//   0.10,    // 99–99.5%
//   0.15,    // 99.5–99.9%
//   0.30     // 99.9–100%
// ];

// // Income distribution breakdown for 90–100% (sums to 1.0 within the decile)
// const incomeDistributionTopDecile: number[] = [
//   0.30,    // 90–95%
//   0.35,    // 95–99%
//   0.10,    // 99–99.5%
//   0.12,    // 99.5–99.9%
//   0.13     // 99.9–100%
// ];

// // Inheritance distribution breakdown for 90–100% (sums to 1.0 within the decile)
// const inheritanceDistributionTopDecile: number[] = [
//   0.15,    // 90–95%
//   0.20,    // 95–99%
//   0.10,    // 99–99.5%
//   0.15,    // 99.5–99.9%
//   0.40     // 99.9–100%
// ];

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

  // Base names and descriptions for the 10 deciles
  private baseNames: string[] = [
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

  private baseDescriptions: string[] = [
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

  // Generate names and descriptions for any number of personas
  private generateNamesAndDescriptions(count: number): { names: string[], descriptions: string[] } {
    const names: string[] = [];
    const descriptions: string[] = [];
    const baseCount = this.baseNames.length;

    for (let i = 0; i < count; i++) {
      // Calculate which base decile this persona belongs to
      const baseIndex = Math.floor((i / count) * baseCount);
      const nextBaseIndex = Math.min(baseIndex + 1, baseCount - 1);

      // Calculate position within the base decile (0 to 1)
      const positionInBase = (i / count) * baseCount - baseIndex;

      // Get the base name and description
      const baseName = this.baseNames[baseIndex];
      const nextBaseName = this.baseNames[nextBaseIndex];
      const baseDesc = this.baseDescriptions[baseIndex];
      const nextBaseDesc = this.baseDescriptions[nextBaseIndex];

      // Calculate the percentage range for this persona
      const startPercent = Math.round((i / count) * 100);
      const endPercent = Math.round(((i + 1) / count) * 100);
      const percentRange = `${startPercent}-${endPercent}%`;

      // Generate interpolated name and description
      const name = positionInBase < 0.5 ? baseName : nextBaseName;
      const description = `${percentRange} Vermögen, ${baseDesc.split(',')[1]}`;

      names.push(name);
      descriptions.push(description);
    }

    return { names, descriptions };
  }

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


  private interpolateDistributionPareto(
    decileDistribution: number[], // Original decile shares (e.g., [0.001, ..., 0.654])
    targetCount: number,          // Number of personas to generate
    alpha: number                 // Pareto shape parameter (e.g., 1.5 for wealth)
  ): number[] {
    const result: number[] = [];
    const decileCount = decileDistribution.length;
    const personasPerDecile = targetCount / decileCount;

    // Generate values for each decile
    for (let decileIndex = 0; decileIndex < decileCount; decileIndex++) {
      const decileTotal = decileDistribution[decileIndex];
      const startIdx = decileIndex * personasPerDecile;
      const endIdx = (decileIndex + 1) * personasPerDecile;

      // Generate values within this decile
      for (let i = startIdx; i < endIdx; i++) {
        // Calculate position within the decile (0 to 1)
        const positionInDecile = (i - startIdx) / personasPerDecile;

        // Use Pareto distribution within each decile
        const value = Math.pow(1 - positionInDecile, -1/alpha);

        // Normalize to ensure the decile sum matches the target
        result.push(value);
      }
    }

    // Normalize each decile to match the target distribution
    for (let decileIndex = 0; decileIndex < decileCount; decileIndex++) {
      const startIdx = decileIndex * personasPerDecile;
      const endIdx = (decileIndex + 1) * personasPerDecile;
      const decileValues = result.slice(startIdx, endIdx);
      const decileSum = decileValues.reduce((a, b) => a + b, 0);
      const targetSum = decileDistribution[decileIndex];

      // Scale the values in this decile
      for (let i = startIdx; i < endIdx; i++) {
        result[i] = (result[i] / decileSum) * targetSum;
      }
    }

    return result;
  }

  // Example usage:
  // const wealthDistribution = [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.06, 0.08, 0.10, 0.654];
  // const incomeDistribution = [0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.46];
  // const inheritanceDistribution = [0.002, 0.004, 0.006, 0.008, 0.01, 0.02, 0.03, 0.05, 0.10, 0.77];



  // Interpolate distribution for any number of personas
  private interpolateDistribution(decileDistribution: number[], targetCount: number): number[] {
    const result: number[] = [];
    const decileCount = decileDistribution.length;

    for (let i = 0; i < targetCount; i++) {
      // Calculate which decile this persona belongs to
      const decileIndex = Math.floor((i / targetCount) * decileCount);
      const nextDecileIndex = Math.min(decileIndex + 1, decileCount - 1);

      // Calculate position within the decile (0 to 1)
      const positionInDecile = (i / targetCount) * decileCount - decileIndex;

      // Linear interpolation between deciles
      const value = decileDistribution[decileIndex] * (1 - positionInDecile) +
                    decileDistribution[nextDecileIndex] * positionInDecile;

      // Normalize to ensure sum is 1
      result.push(value);
    }

    // Normalize the result
    const sum = result.reduce((a, b) => a + b, 0);
    return result.map(v => v / sum);
  }

  // Build personas
  public buildPersonas(): Persona[] {
    const estatesPerDecile = this.config.annualDeaths / this.decileCount;
    const totalCompanyInheritance = this.config.totalInheritance * this.totalAssetDistribution.company;

    // Generate names and descriptions for the current decile count
    const { names, descriptions } = this.generateNamesAndDescriptions(this.decileCount);

    // Interpolate distributions for the target number of personas
    const interpolatedWealthDistribution = this.interpolateDistributionPareto(this.wealthDistribution, this.decileCount, 1.5);
    const interpolatedIncomeDistribution = this.interpolateDistributionPareto(this.incomeDistribution, this.decileCount, 1.8);
    const interpolatedInheritanceDistribution = this.interpolateDistributionPareto(this.inheritanceDistribution, this.decileCount, 1.2);
    const interpolatedCompanyAssetDistribution = this.interpolateDistributionPareto(this.companyAssetDistribution, this.decileCount, 1.2);

    // Validate income distribution
    console.log("\nIncome Distribution Validation:");
    console.log("Total sum:", interpolatedIncomeDistribution.reduce((a, b) => a + b, 0));
    console.log("First 10 values:", interpolatedIncomeDistribution.slice(0, 10));
    console.log("Last 10 values:", interpolatedIncomeDistribution.slice(-10));

    // Check each decile sum matches the original distribution
    for (let i = 0; i < 10; i++) {
      const startIdx = i * 10;
      const endIdx = (i + 1) * 10;
      const decileSum = interpolatedIncomeDistribution.slice(startIdx, endIdx).reduce((a, b) => a + b, 0);
      console.log(`Decile ${i + 1} (${startIdx}-${endIdx}) sum:`, decileSum, "Expected:", this.incomeDistribution[i]);
    }

    // Validate the interpolated distributions
    // console.log("Wealth Distribution Validation:");
    // console.log("First 10 personas sum:", interpolatedWealthDistribution.slice(0, 10).reduce((a, b) => a + b, 0));
    // console.log("Last 10 personas sum:", interpolatedWealthDistribution.slice(-10).reduce((a, b) => a + b, 0));
    // console.log("Total sum:", interpolatedWealthDistribution.reduce((a, b) => a + b, 0));
    // console.log("First value:", interpolatedWealthDistribution[0]);
    // console.log("Last value:", interpolatedWealthDistribution[interpolatedWealthDistribution.length - 1]);
    // console.log("Distribution:", interpolatedWealthDistribution);


    for (let i = 0; i < this.decileCount; i++) {
      // Wealth and income (per household)
      const householdsPerDecile = this.config.totalHouseholds / this.decileCount;
      const totalWealthInDecile = this.config.totalWealth * interpolatedWealthDistribution[i];
      const currentWealth = Math.round(totalWealthInDecile / householdsPerDecile);

      // Fix income calculation
      const totalIncomeInDecile = this.config.totalIncome * interpolatedIncomeDistribution[i];
      console.log("totalIncomeInDecile", totalIncomeInDecile)
      console.log("householdsPerDecile", householdsPerDecile)
      console.log("interpolatedIncomeDistribution", interpolatedIncomeDistribution)
      const currentIncome = Math.round(totalIncomeInDecile / householdsPerDecile);

      // Adjust wealth return rate for higher percentiles
      const baseWealthReturnRate = 0.05;
      const wealthReturnRateMultiplier = 1 + (i / this.decileCount) * 0.5; // Increases with percentile
      const wealthReturnRate = baseWealthReturnRate * wealthReturnRateMultiplier;
      const currentIncomeFromWealth = Math.round(currentWealth * wealthReturnRate);

      // Inheritance (per estate)
      const totalInheritanceInDecile = this.config.totalInheritance * interpolatedInheritanceDistribution[i];
      const inheritanceAmount = Math.round(totalInheritanceInDecile / estatesPerDecile);

      const companyInheritanceInDecile = totalCompanyInheritance * interpolatedCompanyAssetDistribution[i];
      const inheritanceCompany = Math.round(companyInheritanceInDecile / estatesPerDecile);

      const remainingInheritance = inheritanceAmount - inheritanceCompany;
      const housingProportion = this.totalAssetDistribution.housing / (this.totalAssetDistribution.housing + this.totalAssetDistribution.financial);
      const inheritanceHousing = Math.round(remainingInheritance * housingProportion);
      const inheritanceFinancial = Math.round(remainingInheritance * (1 - housingProportion));

      // Taxable inheritance
      const companyExemption = (i >= this.decileCount * 0.9) ? 1.0 : this.companyTaxExemptionRate;
      const inheritanceTaxableCompany = Math.max(0, inheritanceCompany * (1 - companyExemption));
      const inheritanceTaxableHousingFinancial = Math.max(0, (inheritanceHousing + inheritanceFinancial) - this.taxExemptionClass1);
      const inheritanceTaxable = inheritanceTaxableHousingFinancial + inheritanceTaxableCompany;
      const inheritanceTax = this.calculateInheritanceTax(inheritanceTaxableHousingFinancial, inheritanceTaxableCompany, i >= this.decileCount * 0.9);

      // Adjust savings rate for higher percentiles
      const baseSavingsRate = 0.05;
      const savingsRateMultiplier = 1 + (i / this.decileCount) * 0.5; // Increases with percentile
      const savingsRate = baseSavingsRate * savingsRateMultiplier;

      const yearlySpendingFromWealth = Math.round(currentWealth * 0.05);

      // Calculate inheritance age based on percentile position
      const percentilePosition = i / this.decileCount; // 0 to 1
      const inheritanceAge = percentilePosition < 0.5
        ? 55
        : Math.round(50 - (percentilePosition - 0.5) * 10); // Decreases from 50 to 40 for top 50%

      const persona: Persona = {
        ...defaultPersona,
        id: `p${i + 1}`,
        name: names[i],
        description: descriptions[i],
        icon: "👤",
        initialAge: 25,
        currentAge: 60,
        currentIncome,
        currentIncomeFromWealth,
        savingsRate,
        inheritanceAge,
        inheritanceAmount,
        yearlySpendingFromWealth,
        currentWealth,
        inheritanceHousing,
        inheritanceCompany,
        inheritanceFinancial,
        inheritanceTaxable,
        inheritanceTax,
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
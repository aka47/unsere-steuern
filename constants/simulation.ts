import { TaxScenario } from "@/types/life-income"; // Assuming your types are defined here
import { Persona, grokPersonas } from "@/types/persona"; // Your personas file
import { statusQuoScenario } from "@/constants/tax-scenarios"; // Your tax scenarios

// Define tax categories and targets
interface TaxDistribution {
  incomeTax: number;
  vat: number;
  wealthTax: number;
  wealthIncomeTax: number;
  total: number;
}

const baseline: TaxDistribution = {
  incomeTax: 300e9, // €300 billion
  vat: 300e9,
  wealthTax: 0,
  wealthIncomeTax: 40e9, // e.g., capital gains tax
  total: 900e9,
};

const target: TaxDistribution = {
  incomeTax: 0,
  vat: 0,
  wealthTax: 500e9,
  wealthIncomeTax: 240e9,
  total: 740e9, // Adjust if you want to maintain €900 billion
};

// Adjustable tax scenario
const adjustableScenario: TaxScenario = {
  ...statusQuoScenario,
  calculateIncomeTax: (income: number, rateMultiplier: number = 1) => {
    // Modify income tax by a multiplier (0 = no tax, 1 = status quo)
    let tax = 0;
    if (income <= 12096) tax = 0;
    else if (income <= 17443) {
      const y = (income - 12096) / 10000;
      tax = (932.3 * y + 1400) * y * rateMultiplier;
    } else if (income <= 68480) {
      const z = (income - 17443) / 10000;
      tax = ((176.64 * z + 2397) * z + 1015.13) * rateMultiplier;
    } else if (income <= 277825) {
      tax = (0.42 * income - 10911.92) * rateMultiplier;
    } else {
      tax = (0.45 * income - 19246.67) * rateMultiplier;
    }
    return Math.max(0, tax);
  },
  calculateVAT: (income: number, vatRate: number = 19, vatApplicableRate: number = 80) => {
    const grossSpending = income * (vatApplicableRate / 100);
    return grossSpending * (vatRate / (100 + vatRate));
  },
  calculateWealthTax: (wealth: number, rate: number = 0) => {
    const exemption = 1000000; // €1 million exemption
    const taxableWealth = Math.max(0, wealth - exemption);
    return taxableWealth * rate;
  },
  calculateWealthIncomeTax: (wealthIncome: number, rate: number = 0.26375) => {
    return wealthIncome * rate; // Adjustable Abgeltungssteuer
  },
};

// Simulate one year for a persona
function simulateYear(persona: Persona, scenario: TaxScenario, params: TaxParams): TaxResult {
  const incomeTax = scenario.calculateIncomeTax(persona.currentIncome, params.incomeTaxMultiplier);
  const wealthTax = scenario.calculateWealthTax(persona.currentWealth, params.wealthTaxRate);
  const wealthIncomeTax = scenario.calculateWealthIncomeTax(persona.currentIncomeFromWealth, params.wealthIncomeTaxRate);
  const vat = scenario.calculateVAT(persona.currentIncome, params.vatRate, 80); // 80% spending assumption
  const totalTax = incomeTax + wealthTax + wealthIncomeTax + vat;

  return { incomeTax, vat, wealthTax, wealthIncomeTax, totalTax };
}

// Aggregate taxes across population
interface TaxParams {
  incomeTaxMultiplier: number;
  vatRate: number;
  wealthTaxRate: number;
  wealthIncomeTaxRate: number;
}

interface TaxResult {
  incomeTax: number;
  vat: number;
  wealthTax: number;
  wealthIncomeTax: number;
  totalTax: number;
}

function calculateTotalTaxes(personas: Persona[], params: TaxParams): TaxDistribution {
  let total: TaxDistribution = { incomeTax: 0, vat: 0, wealthTax: 0, wealthIncomeTax: 0, total: 0 };
  const populationPerDecile = 83e6 / personas.length; // 8.3 million per persona

  for (const persona of personas) {
    const result = simulateYear(persona, adjustableScenario, params);
    total.incomeTax += result.incomeTax * populationPerDecile;
    total.vat += result.vat * populationPerDecile;
    total.wealthTax += result.wealthTax * populationPerDecile;
    total.wealthIncomeTax += result.wealthIncomeTax * populationPerDecile;
    total.total += result.totalTax * populationPerDecile;
  }

  return total;
}

// Balancing algorithm
function balanceTaxSystem(
  personas: Persona[],
  initialParams: TaxParams,
  target: TaxDistribution,
  maxIterations: number = 100,
  tolerance: number = 1e9 // €1 billion tolerance
): { params: TaxParams; result: TaxDistribution } {
  let params = { ...initialParams };
  let current = calculateTotalTaxes(personas, params);
  let iteration = 0;

  while (iteration < maxIterations) {
    // Calculate differences from target
    const diff = {
      incomeTax: target.incomeTax - current.incomeTax,
      vat: target.vat - current.vat,
      wealthTax: target.wealthTax - current.wealthTax,
      wealthIncomeTax: target.wealthIncomeTax - current.wealthIncomeTax,
    };

    // Check if within tolerance
    if (
      Math.abs(diff.incomeTax) < tolerance &&
      Math.abs(diff.vat) < tolerance &&
      Math.abs(diff.wealthTax) < tolerance &&
      Math.abs(diff.wealthIncomeTax) < tolerance
    ) {
      break;
    }

    // Adjust parameters
    if (diff.incomeTax > 0) params.incomeTaxMultiplier += 0.01;
    else if (diff.incomeTax < 0) params.incomeTaxMultiplier = Math.max(0, params.incomeTaxMultiplier - 0.01);

    if (diff.vat > 0) params.vatRate += 0.1;
    else if (diff.vat < 0) params.vatRate = Math.max(0, params.vatRate - 0.1);

    if (diff.wealthTax > 0) params.wealthTaxRate += 0.001; // 0.1% increment
    else if (diff.wealthTax < 0) params.wealthTaxRate = Math.max(0, params.wealthTaxRate - 0.001);

    if (diff.wealthIncomeTax > 0) params.wealthIncomeTaxRate += 0.01;
    else if (diff.wealthIncomeTax < 0) params.wealthIncomeTaxRate = Math.max(0, params.wealthIncomeTaxRate - 0.01);

    // Recalculate
    current = calculateTotalTaxes(personas, params);
    iteration++;

    console.log(`Iteration ${iteration}:`, { params, current });
  }

  return { params, result: current };
}

// Run the simulation
const initialParams: TaxParams = {
  incomeTaxMultiplier: 1, // Status quo income tax
  vatRate: 19, // Standard VAT rate
  wealthTaxRate: 0, // No wealth tax initially
  wealthIncomeTaxRate: 0.26375, // 25% + 5.5% solidarity surcharge
};

console.log("Baseline:", calculateTotalTaxes(grokPersonas, initialParams));
const { params: finalParams, result: finalResult } = balanceTaxSystem(grokPersonas, initialParams, target);
console.log("Final Parameters:", finalParams);
console.log("Final Tax Distribution:", finalResult);

export { baseline, target, finalResult };
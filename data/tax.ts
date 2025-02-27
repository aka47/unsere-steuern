// Tax revenue data in Germany
// Source: Federal Statistical Office, June 5, 2024

// Define TypeScript interfaces
export interface TaxCategory {
  category: string;
  amount: number;
  percentage: number;
  description: string;
}

// Tax revenue breakdown in billion euros
export const taxRevenueBreakdown: TaxCategory[] = [
  {
    category: "Einkommensteuer",
    amount: 410.1,
    percentage: 43.76,
    description: "Lohn-, Gehalts- und veranlagte Einkommensteuer (inkl. ~€41 Mrd. Kapitalertragsteuer)"
  },
  {
    category: "Mehrwertsteuer",
    amount: 298.4,
    percentage: 31.84,
    description: "Verbrauchsteuer auf Waren und Dienstleistungen"
  },
  {
    category: "Energiesteuer",
    amount: 37.6,
    percentage: 4.01,
    description: "Steuer auf Energieverbrauch (höchste Bundessteuer)"
  },
  {
    category: "Tabaksteuer",
    amount: 14.7,
    percentage: 1.57,
    description: "Verbrauchsteuer auf Tabakprodukte"
  },
  {
    category: "Körperschaftsteuer",
    amount: 100.3,
    percentage: 10.70,
    description: "Steuer auf Unternehmensgewinne"
  },
  {
    category: "Erbschaftsteuer",
    amount: 11.05,
    percentage: 1.18,
    description: "Steuer auf Vermögensübertragungen (Ländereinnahme)"
  },
  {
    category: "Andere Steuern",
    amount: 64.95,
    percentage: 6.93,
    description: "Grunderwerbsteuer, Kfz-Steuer, etc."
  }
];

// Constants for tax and wealth data
export const TOTAL_TAX_REVENUE = 937.1; // billion euros
export const TOTAL_WEALTH = 13400; // billion euros (13.4 trillion)
// Wealth tax data for Germany (2024)
export const WEALTH_TAX_DATA = {
  totalWealth: 13400, // Total wealth in billion €
  annualGrowth: 402, // Annual growth (3%) in billion €
  inheritanceTransfers: 400, // Annual inheritance transfers in billion €
  taxableInheritance: 100, // Taxable inheritance in billion €
  realizedAndTaxed: 48.5, // Realized and taxed in billion €
  untaxedUnrealized: 361.8, // Untaxed (unrealized) in billion €
  percentageUntaxed: 90, // Percentage untaxed
};

// Data for the comparison chart
export const COMPARISON_DATA = [
  {
    name: "Vermögenszuwachs",
    value: WEALTH_TAX_DATA.annualGrowth,
  },
  {
    name: "Erbschaften",
    value: WEALTH_TAX_DATA.inheritanceTransfers,
  },
  {
    name: "Kapitalertragsteuer",
    value: 37, // Capital gains tax in billion €
  },
  {
    name: "Erbschaftsteuer",
    value: 11.5, // Inheritance tax in billion €
  },
];

// Data for the taxation gap pie chart
export const TAXATION_GAP_DATA = [
  {
    name: "Besteuert",
    value: WEALTH_TAX_DATA.realizedAndTaxed,
    color: "#82ca9d",
  },
  {
    name: "Unbesteuert",
    value: WEALTH_TAX_DATA.untaxedUnrealized,
    color: "#ff8042",
  },
];

// Tax breakdown data
export const TAX_BREAKDOWN = [
  {
    name: "Kapitalertragsteuer",
    value: 37, // Capital gains tax in billion €
  },
  {
    name: "Erbschaftsteuer",
    value: 11.5, // Inheritance tax in billion €
  },
];

// Effective tax rate data
export const EFFECTIVE_TAX_RATE_DATA = [
  {
    name: "Vermögen",
    rate: 6.1, // Effective tax rate on wealth in %
  },
  {
    name: "Arbeitseinkommen",
    rate: 25.3, // Effective tax rate on labor income in %
  },
];

// Tax rate comparison data
export const TAX_RATE_COMPARISON = [
  {
    name: "Vermögen",
    value: 6.1,
  },
  {
    name: "Arbeitseinkommen",
    value: 25.3,
  },
];
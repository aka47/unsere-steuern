// Wealth distribution data in Germany
// Source: [Add source here]

// Wealth distribution by decile in trillion euros
export const wealthDistributionByDecile = [
  { decile: "0-10%", wealth: 0.066, label: "0-10%" },
  { decile: "10-20%", wealth: 0.092, label: "10-20%" },
  { decile: "20-30%", wealth: 0.145, label: "20-30%" },
  { decile: "30-40%", wealth: 0.211, label: "30-40%" },
  { decile: "40-50%", wealth: 0.317, label: "40-50%" },
  { decile: "50-60%", wealth: 0.475, label: "50-60%" },
  { decile: "60-70%", wealth: 0.686, label: "60-70%" },
  { decile: "70-80%", wealth: 1.029, label: "70-80%" },
  { decile: "80-90%", wealth: 2.179, label: "80-90%" },
  // { decile: "Decle 10 (90-100%)", wealth: 7.3864, label: "90-100%" },
  { percentile: "90-95%", wealth: 2.1344, label: "90-95%" },
  { percentile: "96-97%", wealth: 0.517, label: "96-97%" },
  { percentile: "97-98%", wealth: 0.658, label: "97-98%" },
  { percentile: "98-99%", wealth: 0.915, label: "98-99%" },
  { percentile: "99-100%", wealth: 2.748, label: "99-100%" },
];

// Total wealth in trillion euros
export const totalWealth = 13.19;

// Wealth distribution by decile in euros per person
export const wealthPerPersonByDecile = [
  { decile: "Decile 1 (0-10%)", wealth: 7932, label: "0-10%" },
  { decile: "Decile 2 (10-20%)", wealth: 11058, label: "10-20%" },
  { decile: "Decile 3 (20-30%)", wealth: 17428, label: "20-30%" },
  { decile: "Decile 4 (30-40%)", wealth: 25361, label: "30-40%" },
  { decile: "Decile 5 (40-50%)", wealth: 38101, label: "40-50%" },
  { decile: "Decile 6 (50-60%)", wealth: 57091, label: "50-60%" },
  { decile: "Decile 7 (60-70%)", wealth: 82452, label: "60-70%" },
  { decile: "Decile 8 (70-80%)", wealth: 123678, label: "70-80%" },
  { decile: "Decile 9 (80-90%)", wealth: 261899, label: "80-90%" },
  { decile: "Decile 10 (90-100%)", wealth: 887788, label: "90-100%" },
];

// Wealth distribution by groups (for simplified charts)
export const wealthDistributionByGroups = [
  {
    group: "Untere 50%",
    percentage: ((0.066 + 0.092 + 0.145 + 0.211 + 0.317) / totalWealth) * 100,
    amount: "0.83 Bio. €",
  },
  {
    group: "Mittlere 40%",
    percentage: ((0.475 + 0.686 + 1.029 + 2.179) / totalWealth) * 100,
    amount: "4.37 Bio. €",
  },
  {
    group: "Obere 10%",
    percentage: (7.3864 / totalWealth) * 100,
    amount: "7.39 Bio. €",
  },
  {
    group: "Obere 1%",
    percentage: 27.4, // Assuming this value from the original data
    amount: "3.61 Bio. €",
  },
];

// Wealth breakdown by category in trillion euros
export const wealthBreakdownByCategory = [
  {
    category: "Hauptwohnsitz",
    value: 5.32,
    description: "Nettowert der Hauptwohnsitze (brutto €6,43 Bio. minus €1,11 Bio. Hypothekenschulden)",
    percentage: (5.32 / totalWealth) * 100,
  },
  {
    category: "Andere Immobilien",
    value: 2.76,
    description: "Nettowert von Zweitwohnungen oder Mietobjekten",
    percentage: (2.76 / totalWealth) * 100,
  },
  {
    category: "Fahrzeuge & Wertgegenstände",
    value: 0.496,
    description: "Autos, Schmuck, etc.",
    percentage: (0.496 / totalWealth) * 100,
  },
  {
    category: "Spareinlagen",
    value: 1.298,
    description: "Bankkonten, Sparkonten",
    percentage: (1.298 / totalWealth) * 100,
  },
  {
    category: "Investitionen",
    value: 1.601,
    description: "Aktien, Investmentfonds, Anleihen, private Altersvorsorge",
    percentage: (1.601 / totalWealth) * 100,
  },
  {
    category: "Unternehmensvermögen",
    value: 1.67,
    description: "Eigenkapital in Privatunternehmen",
    percentage: (1.67 / totalWealth) * 100,
  },
];
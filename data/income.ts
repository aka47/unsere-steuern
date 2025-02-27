// Income distribution data in Germany
// Source: [Add source here]

// Income distribution by percentile in trillion euros
export const incomeDistributionByPercentile = [
  { percentile: "0-10%", total: 0.0747, wages: 0.0732, wealthIncome: 0.0005, label: "0-10%" },
  { percentile: "10-20%", total: 0.0996, wages: 0.0976, wealthIncome: 0.0007, label: "10-20%" },
  { percentile: "20-30%", total: 0.1245, wages: 0.1218, wealthIncome: 0.0010, label: "20-30%" },
  { percentile: "30-40%", total: 0.1494, wages: 0.1459, wealthIncome: 0.0015, label: "30-40%" },
  { percentile: "40-50%", total: 0.1743, wages: 0.1695, wealthIncome: 0.0022, label: "40-50%" },
  { percentile: "50-60%", total: 0.1992, wages: 0.1922, wealthIncome: 0.0035, label: "50-60%" },
  { percentile: "60-70%", total: 0.2241, wages: 0.2145, wealthIncome: 0.0056, label: "60-70%" },
  { percentile: "70-80%", total: 0.2739, wages: 0.2589, wealthIncome: 0.0090, label: "70-80%" },
  { percentile: "80-90%", total: 0.3486, wages: 0.3226, wealthIncome: 0.0150, label: "80-90%" },
  { percentile: "90-95%", total: 0.1992, wages: 0.1772, wealthIncome: 0.0150, label: "90-95%" },
  { percentile: "96-97%", total: 0.1494, wages: 0.1295, wealthIncome: 0.0130, label: "96-97%" },
  { percentile: "97-98%", total: 0.1494, wages: 0.1265, wealthIncome: 0.0150, label: "97-98%" },
  { percentile: "98-99%", total: 0.1992, wages: 0.1622, wealthIncome: 0.0250, label: "98-99%" },
  { percentile: "99-100%", total: 0.2489, wages: 0.1772, wealthIncome: 0.0550, label: "99-100%" },
];

// Calculate total income
export const totalIncome = incomeDistributionByPercentile.reduce((sum, item) => sum + item.total, 0);

// Income distribution by groups (for simplified charts)
export const incomeDistributionByGroups = [
  {
    group: "Untere 50%",
    total: 0.0747 + 0.0996 + 0.1245 + 0.1494 + 0.1743,
    wages: 0.0732 + 0.0976 + 0.1218 + 0.1459 + 0.1695,
    wealthIncome: 0.0005 + 0.0007 + 0.0010 + 0.0015 + 0.0022,
    percentage: ((0.0747 + 0.0996 + 0.1245 + 0.1494 + 0.1743) / totalIncome) * 100,
  },
  {
    group: "Mittlere 40%",
    total: 0.1992 + 0.2241 + 0.2739 + 0.3486,
    wages: 0.1922 + 0.2145 + 0.2589 + 0.3226,
    wealthIncome: 0.0035 + 0.0056 + 0.0090 + 0.0150,
    percentage: ((0.1992 + 0.2241 + 0.2739 + 0.3486) / totalIncome) * 100,
  },
  {
    group: "Obere 10%",
    total: 0.1992 + 0.1494 + 0.1494 + 0.1992 + 0.2489,
    wages: 0.1772 + 0.1295 + 0.1265 + 0.1622 + 0.1772,
    wealthIncome: 0.0150 + 0.0130 + 0.0150 + 0.0250 + 0.0550,
    percentage: ((0.1992 + 0.1494 + 0.1494 + 0.1992 + 0.2489) / totalIncome) * 100,
  },
  {
    group: "Obere 1%",
    total: 0.2489,
    wages: 0.1772,
    wealthIncome: 0.0550,
    percentage: (0.2489 / totalIncome) * 100,
  },
];
export const formatMoney = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `€${(value / 1_000_000_000).toFixed(0)} Mrd`;
  } else if (value >= 1_000_000) {
    return `€${(value / 1_000_000).toFixed(0)} M`;
  } else if (value >= 1_000) {
    return `€${(value / 1_000).toFixed(0)}k`;
  }
  return `€${value.toFixed(2)}`;
};
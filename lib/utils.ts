import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as a currency string with German abbreviations for large numbers
 * @param value The number to format
 * @param locale The locale to use for formatting (default: 'de-DE')
 * @param currency The currency to use (default: 'EUR')
 * @param useAbbreviations Whether to use German abbreviations for large numbers (default: true)
 * @returns A formatted currency string
 */
export function formatCurrency(
  value: number,
  locale = "de-DE",
  currency = "EUR",
  useAbbreviations = true
): string {
  if (!useAbbreviations) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1_000_000_000_000) { // Billion (1e12)
    return `${sign}${(value / 1_000_000_000_000).toFixed(1)} Bio. €`;
  }
  if (absValue >= 1_000_000_000) { // Milliarde (1e9)
    return `${sign}${(value / 1_000_000_000).toFixed(1)} Mrd. €`;
  }
  if (absValue >= 1_000_000) { // Million (1e6)
    return `${sign}${(value / 1_000_000).toFixed(1)} Mio. €`;
  }
  if (absValue >= 1_000) { // Thousand
    return `${sign}${(value / 1_000).toFixed(1)}T €`;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as a currency string
 * @param value The number to format
 * @param locale The locale to use for formatting (default: 'de-DE')
 * @param currency The currency to use (default: 'EUR')
 * @returns A formatted currency string
 */
export function formatCurrency(
  value: number,
  locale = "de-DE",
  currency = "EUR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

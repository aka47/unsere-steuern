export const TAX_BRACKETS = [
  { limit: 11604, rate: 0 },
  { limit: 17005, rate: 0.14 },
  { limit: 66761, rate: 0.24 },
  { limit: 277826, rate: 0.42 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.45 },
]

export const INHERITANCE_TAX_CLASSES = {
  1: [
    { limit: 75000, rate: 0.07 },
    { limit: 300000, rate: 0.11 },
    { limit: 600000, rate: 0.15 },
    { limit: 6000000, rate: 0.19 },
    { limit: 13000000, rate: 0.23 },
    { limit: 26000000, rate: 0.27 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.3 },
  ],
  2: [
    { limit: 75000, rate: 0.15 },
    { limit: 300000, rate: 0.2 },
    { limit: 600000, rate: 0.25 },
    { limit: 6000000, rate: 0.3 },
    { limit: 13000000, rate: 0.35 },
    { limit: 26000000, rate: 0.4 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.43 },
  ],
  3: [
    { limit: 75000, rate: 0.3 },
    { limit: 300000, rate: 0.3 },
    { limit: 600000, rate: 0.3 },
    { limit: 6000000, rate: 0.3 },
    { limit: 13000000, rate: 0.5 },
    { limit: 26000000, rate: 0.5 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.5 },
  ],
} as const
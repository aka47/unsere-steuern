import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaxDistribution } from "@/types/life-income"

interface TaxSimulationResultsProps {
  baseline: TaxDistribution
  target: TaxDistribution
  result: TaxDistribution
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export const TaxSimulationResults = ({ baseline, target, result }: TaxSimulationResultsProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Steueraufkommen Simulation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Status Quo</h3>
            <div className="space-y-1 text-sm">
              <p>Einkommenssteuer: {formatCurrency(baseline.incomeTax)}</p>
              <p>Umsatzsteuer: {formatCurrency(baseline.vat)}</p>
              <p>Vermögenssteuer: {formatCurrency(baseline.wealthTax)}</p>
              <p>Kapitalertragssteuer: {formatCurrency(baseline.wealthIncomeTax)}</p>
              <p className="font-semibold">Gesamt: {formatCurrency(baseline.total)}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Ziel</h3>
            <div className="space-y-1 text-sm">
              <p>Einkommenssteuer: {formatCurrency(target.incomeTax)}</p>
              <p>Umsatzsteuer: {formatCurrency(target.vat)}</p>
              <p>Vermögenssteuer: {formatCurrency(target.wealthTax)}</p>
              <p>Kapitalertragssteuer: {formatCurrency(target.wealthIncomeTax)}</p>
              <p className="font-semibold">Gesamt: {formatCurrency(target.total)}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Simulation</h3>
            <div className="space-y-1 text-sm">
              <p>Einkommenssteuer: {formatCurrency(result.incomeTax)}</p>
              <p>Umsatzsteuer: {formatCurrency(result.vat)}</p>
              <p>Vermögenssteuer: {formatCurrency(result.wealthTax)}</p>
              <p>Kapitalertragssteuer: {formatCurrency(result.wealthIncomeTax)}</p>
              <p className="font-semibold">Gesamt: {formatCurrency(result.total)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
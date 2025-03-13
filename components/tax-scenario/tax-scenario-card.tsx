import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { TaxScenario } from "@/types/life-income"

interface TaxScenarioCardProps {
  scenario: TaxScenario
}

export function TaxScenarioCard({ scenario }: TaxScenarioCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{scenario.name}</CardTitle>
        <CardDescription>{scenario.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {scenario.detailedDescription && (
          <p className="text-sm text-gray-600">{scenario.detailedDescription}</p>
        )}
      </CardContent>
    </Card>
  )
}
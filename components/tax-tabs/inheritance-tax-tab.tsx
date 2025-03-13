import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { INHERITANCE_TAX_CLASSES, INHERITANCE_TAX_DATA } from "@/data/tax-data"
import Inheritance from "@/components/tax-tabs/inheritance"

export function InheritanceTaxTab() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Erbschaftssteuer Übersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">Gesamtes Erbe</h3>
              <p className="text-2xl font-bold">{(INHERITANCE_TAX_DATA.totalInheritance / 1e9).toFixed(1)} Mrd. €</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Steuerpflichtiges Erbe</h3>
              <p className="text-2xl font-bold">{(INHERITANCE_TAX_DATA.inheritanceTaxable / 1e9).toFixed(1)} Mrd. €</p>
            </div>
            <div>
              <div className="text-sm font-medium">Steuereinnahmen</div>
              <p className="text-2xl font-bold">{(INHERITANCE_TAX_DATA.taxRevenue / 1e9).toFixed(1)} Mrd. €</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Inheritance />

      {Object.entries(INHERITANCE_TAX_CLASSES).map(([classKey, classData]) => (
        <Card key={classKey}>
          <CardHeader>
            <CardTitle>{classData.description}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {classData.brackets.map((bracket, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>Bis {(bracket.limit / 1000).toFixed(0)} Tsd. €</span>
                  <span>{(bracket.rate * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


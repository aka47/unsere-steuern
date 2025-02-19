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
              <p className="text-2xl font-bold">{(INHERITANCE_TAX_DATA.taxableInheritance / 1e9).toFixed(1)} Mrd. €</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Steueraufkommen</h3>
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
            <ul className="space-y-2">
              {classData.brackets.map((bracket, index) => (
                <li key={index} className="flex justify-between">
                  <span>
                    {index === 0 ? "0" : `${classData.brackets[index - 1].limit + 1}`} € -{" "}
                    {bracket.limit === Number.POSITIVE_INFINITY ? "∞" : `${bracket.limit} €`}
                  </span>
                  <span className="font-semibold">{(bracket.rate * 100).toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


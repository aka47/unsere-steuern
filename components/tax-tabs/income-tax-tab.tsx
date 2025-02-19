"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { INCOME_TAX_BRACKETS, INCOME_TAX_DATA, INCOME_TAX_YEARLY } from "@/data/tax-data"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function IncomeTaxTab() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Einkommenssteuer Übersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Jährliches Steueraufkommen</h3>
              <p className="text-2xl font-bold">{(INCOME_TAX_DATA.totalRevenue / 1e9).toFixed(1)} Mrd. €</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Gesamtes Bruttoeinkommen</h3>
              <p className="text-2xl font-bold">{(INCOME_TAX_DATA.totalGrossIncome / 1e9).toFixed(1)} Mrd. €</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Einkommenssteuer-Stufen</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {INCOME_TAX_BRACKETS.map((bracket, index) => (
              <li key={index} className="flex justify-between">
                <span>
                  {index === 0 ? "0" : `${INCOME_TAX_BRACKETS[index - 1].limit + 1}`} € -{" "}
                  {bracket.limit === Number.POSITIVE_INFINITY ? "∞" : `${bracket.limit} €`}
                </span>
                <span className="font-semibold">{(bracket.rate * 100).toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Einkommenssteuer-Entwicklung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={INCOME_TAX_YEARLY}>
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `${(value / 1e9).toFixed(0)} Mrd`} />
                <Tooltip
                  formatter={(value: number) => `${(value / 1e9).toFixed(1)} Mrd. €`}
                  labelFormatter={(label) => `Jahr: ${label}`}
                />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


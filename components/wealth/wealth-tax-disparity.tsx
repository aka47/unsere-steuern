"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  TAXATION_GAP_DATA,
  WEALTH_TAX_DATA
} from "@/data/wealth-tax"

const formatBillionEuros = (value: number) => {
  return `${value.toFixed(1)} Mrd. €`
}

const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`
}

// Convert from trillion to billion for consistency
const totalWagesIncomeInBillions = 1678;

// Subtract capital gains tax from income tax to get pure labor income tax
const laborIncomeTaxAmount = 242;


const INCOME_COMPARISON_DATA = [
  {
    name: "Arbeitseinkommen",
    value: totalWagesIncomeInBillions,
    fill: "#a4de6c"
  },
  {
    name: "Einkommensteuer",
    value: laborIncomeTaxAmount,
    fill: "#d0ed57"
  }
];

// Calculate effective tax rates
const wealthTaxRate = (WEALTH_TAX_DATA.realizedAndTaxed / (WEALTH_TAX_DATA.annualGrowth + WEALTH_TAX_DATA.inheritanceTransfers)) * 100;
const incomeTaxRate = (laborIncomeTaxAmount / totalWagesIncomeInBillions) * 100;

export const WealthTaxDisparity = () => {
  const [, setActiveTab] = useState("comparison")

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Vermögenszuwachs und Besteuerung</CardTitle>
        <CardDescription>
          Vergleich zwischen Vermögenszuwachs, Erbschaften und tatsächlich besteuerten Beträgen
        </CardDescription>
      </CardHeader>
      <CardContent>

        <Tabs defaultValue="comparison" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="comparison">Vergleich</TabsTrigger>
            <TabsTrigger value="gap">Besteuerungslücke</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-[400px] mt-4">
                <h3 className="text-center font-medium mb-2">Vermögen vs. Vermögenssteuern</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart
                    data={[
                      {
                        name: "Vermögen",
                        Vermögenszuwachs: WEALTH_TAX_DATA.annualGrowth,
                        Erbschaften: WEALTH_TAX_DATA.inheritanceTransfers
                      },
                      {
                        name: "Steuern",
                        Kapitalertragsteuer: 37,
                        Erbschaftsteuer: 11.5
                      }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value} Mrd. €`} />
                    <Tooltip formatter={(value: number, name: string) => [`${value.toFixed(1)} Mrd. €`, name]} />
                    <Legend />
                    <Bar dataKey="Vermögenszuwachs" name="Vermögenszuwachs" stackId="a" fill="#8884d8" />
                    <Bar dataKey="Erbschaften" name="Erbschaften" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="Kapitalertragsteuer" name="Kapitalertragsteuer" stackId="b" fill="#ffc658" />
                    <Bar dataKey="Erbschaftsteuer" name="Erbschaftsteuer" stackId="b" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-[400px] mt-4">
                <h3 className="text-center font-medium mb-2">Arbeitseinkommen & Einkommensteuer</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart
                    data={INCOME_COMPARISON_DATA}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value} Mrd. €`} />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        return [`${value.toFixed(1)} Mrd. €`, name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Betrag" fill="#a4de6c">
                      {INCOME_COMPARISON_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-4">
              <p>
                <strong>Vermögenszuwachs & Erbschaften:</strong> Jährlich entstehen etwa {formatBillionEuros(WEALTH_TAX_DATA.annualGrowth + WEALTH_TAX_DATA.inheritanceTransfers)} an Vermögenszuwachs und Erbschaften.
              </p>
              <p>
                <strong>Vermögensbezogene Steuern:</strong> Davon werden nur {formatBillionEuros(WEALTH_TAX_DATA.realizedAndTaxed)} ({formatPercentage(wealthTaxRate)}) besteuert.
              </p>
              <p>
                <strong>Vergleich mit Arbeitseinkommen:</strong> Während Arbeitseinkommen mit durchschnittlich {formatPercentage(incomeTaxRate)} besteuert werden, liegt der effektive Steuersatz auf Vermögenszuwachs und Erbschaften bei nur etwa {formatPercentage(wealthTaxRate)}.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="gap" className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={TAXATION_GAP_DATA}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {TAXATION_GAP_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value} Mrd. €`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-muted-foreground mt-4 max-w-md">
                <p>
                  <strong>Unbesteuert:</strong> {formatBillionEuros(WEALTH_TAX_DATA.untaxedUnrealized)} ({formatPercentage(WEALTH_TAX_DATA.percentageUntaxed)} des Vermögenszuwachses)
                </p>
                <p>
                  <strong>Besteuert:</strong> {formatBillionEuros(WEALTH_TAX_DATA.realizedAndTaxed)} ({formatPercentage(100 - WEALTH_TAX_DATA.percentageUntaxed)} des Vermögenszuwachses)
                </p>
                <p className="mt-2">
                  Die Besteuerungslücke entsteht hauptsächlich durch nicht realisierte Kapitalgewinne und Steuervermeidungsstrategien bei Erbschaften.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
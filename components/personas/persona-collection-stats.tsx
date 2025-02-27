import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import type { PersonaCollection } from "@/types/personaCollection"
import { useLifeIncomeCalculator } from "@/hooks/useLifeIncomeCalculator"

interface PersonaCollectionStatsProps {
  collection: PersonaCollection
}

export function PersonaCollectionStats({ collection }: PersonaCollectionStatsProps) {
  const { calculateLifeIncome } = useLifeIncomeCalculator()

  // Calculate lifetime stats for each persona
  const personaStats = collection.personas.map(persona => {
    const results = calculateLifeIncome({
      ...persona,
      currentAge: persona.initialAge,
      currentPersona: persona,
    })

    if (!results) {
      return {
        name: persona.name,
        totalIncome: 0,
        totalWealth: 0,
        totalTaxes: 0,
        effectiveTaxRate: 0,
        savingsRate: persona.savingsRate * 100,
        inheritance: persona.inheritanceAmount,
        disposableIncome: 0
      }
    }

    const totalTaxes = results.totals.totalIncomeTax + results.totals.totalVAT + results.totals.totalInheritanceTax

    return {
      name: persona.name,
      totalIncome: results.totals.totalIncome,
      totalWealth: results.totals.totalWealth,
      totalTaxes,
      effectiveIncomeTaxRate: (results.totals.totalIncomeTax / results.totals.totalIncome) * 100,
      effectiveTaxRate: (totalTaxes / (results.totals.totalIncome + results.totals.totalWealth)) * 100,
      savingsRate: persona.savingsRate * 100,
      inheritance: persona.inheritanceAmount,
      disposableIncome: results.totals.totalIncome - (results.totals.totalIncomeTax + results.totals.totalVAT)
    }
  })

  // Sort personas by total income for better visualization
  const sortedStats = [...personaStats].sort((a, b) => a.totalIncome - b.totalIncome)

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Statistische Auswertung</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="taxes">
          <TabsList>
            <TabsTrigger value="taxes">Steuern</TabsTrigger>
            <TabsTrigger value="income">Einkommen & Vermögen</TabsTrigger>
            <TabsTrigger value="inheritance">Erbschaften</TabsTrigger>
          </TabsList>

          <TabsContent value="taxes" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Effektive Steuerquote</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sortedStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis label={{ value: 'Prozent', position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Bar dataKey="effectiveTaxRate" fill="#8884d8" name="Effektive Steuerquote" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Steueraufkommen nach Art</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sortedStats}
                        dataKey="totalTaxes"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {sortedStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${(index * 360) / sortedStats.length}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toLocaleString('de-DE')} €`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="income" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Einkommensverteilung</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sortedStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis label={{ value: 'Euro', position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => `${value.toLocaleString('de-DE')} €`} />
                      <Line type="monotone" dataKey="totalIncome" stroke="#8884d8" name="Lebenseinkommen" />
                      <Line type="monotone" dataKey="disposableIncome" stroke="#82ca9d" name="Verfügbares Einkommen" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sparquote und Vermögensaufbau</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sortedStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis label={{ value: 'Prozent/Euro', position: 'insideLeft' }} />
                      <Tooltip formatter={(value, name) => name === 'savingsRate' ? `${value}%` : `${value.toLocaleString('de-DE')} €`} />
                      <Legend />
                      <Bar dataKey="savingsRate" fill="#8884d8" name="Sparquote" />
                      <Bar dataKey="totalWealth" fill="#82ca9d" name="Vermögen" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inheritance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Erbschaftsverteilung</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sortedStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis label={{ value: 'Euro', position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => `${value.toLocaleString('de-DE')} €`} />
                      <Legend />
                      <Bar dataKey="inheritance" fill="#ffc658" name="Erbschaft" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vermögensentwicklung</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sortedStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis label={{ value: 'Euro', position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => `${value.toLocaleString('de-DE')} €`} />
                      <Legend />
                      <Bar dataKey="totalWealth" fill="#8884d8" name="Ohne Erbschaft" />
                      <Bar dataKey="inheritance" fill="#82ca9d" name="Mit Erbschaft" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
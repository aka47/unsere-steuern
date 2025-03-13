"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import * as d3 from "d3"
import type { Persona } from "@/types/persona"
import { PersonaSegmentStats } from "@/hooks/usePersonaSegmentCalculator"

interface DataPoint {
  year: number
  personaId: string
  personaName: string
  wealth: number
  taxRate: number
}

interface PersonaStackedAreaChartProps {
  personas: Persona[]
  personaStats: PersonaSegmentStats[]
}

export function PersonaStackedAreaChart({ personas, personaStats }: PersonaStackedAreaChartProps) {
  // Transform persona stats into data points
  const data = useMemo(() => {
    const dataPoints: DataPoint[] = []

    personaStats.forEach(stat => {
      const persona = stat.persona
      stat.results.details.forEach(detail => {
        const year = 2024 - (65 - detail.age)
        dataPoints.push({
          year,
          personaId: persona.id,
          personaName: persona.name,
          wealth: detail.wealth,
          taxRate: (detail.incomeTax + detail.wealthTax + detail.vat + detail.inheritanceTax) / detail.income
        })
      })
    })

    return dataPoints
  }, [personaStats])

  // Get unique years and sort them
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(data.map((d) => d.year))).sort((a, b) => a - b)
    return uniqueYears
  }, [data])

  // Get min and max values for both metrics
  const { minWealth, maxWealth, minTaxRate, maxTaxRate } = useMemo(() => {
    const wealthValues = data.map((d) => d.wealth)
    const taxRateValues = data.map((d) => d.taxRate)
    return {
      minWealth: Math.min(...wealthValues),
      maxWealth: Math.max(...wealthValues),
      minTaxRate: Math.min(...taxRateValues),
      maxTaxRate: Math.max(...taxRateValues),
    }
  }, [data])

  // Format data for the chart
  const chartData = useMemo(() => {
    return years.map(year => {
      const yearData: any = { year }

      personas.forEach(persona => {
        const point = data.find(d => d.personaId === persona.id && d.year === year)
        if (point) {
          yearData[`${persona.name} - Wealth`] = point.wealth
          yearData[`${persona.name} - Tax Rate`] = point.taxRate * 100 // Convert to percentage
        }
      })

      return yearData
    })
  }, [years, personas, data])

  // Generate colors for each persona
  const colors = useMemo(() => {
    const baseColors = [
      "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
      "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
    ]

    const personaColors: { [key: string]: string } = {}
    personas.forEach((persona, index) => {
      personaColors[`${persona.name} - Wealth`] = baseColors[index % baseColors.length]
      personaColors[`${persona.name} - Tax Rate`] = d3.interpolateReds(0.3 + (index / personas.length) * 0.7)
    })

    return personaColors
  }, [personas])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Stacked Area Chart - Wealth & Tax Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                {Object.entries(colors).map(([key, color]) => (
                  <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                tickFormatter={(value) => value.toString()}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={5}
              />
              <YAxis
                yAxisId="wealth"
                orientation="left"
                tickFormatter={(value) => new Intl.NumberFormat("de-DE", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0
                }).format(value)}
              />
              <YAxis
                yAxisId="taxRate"
                orientation="right"
                tickFormatter={(value) => `${value.toFixed(1)}%`}
                domain={[0, 100]}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name.includes("Tax Rate")) {
                    return [`${value.toFixed(2)}%`, name]
                  }
                  return [
                    new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: "EUR"
                    }).format(value),
                    name
                  ]
                }}
              />
              <Legend />
              {personas.map(persona => (
                <>
                  <Area
                    key={`${persona.name}-wealth`}
                    yAxisId="wealth"
                    type="monotone"
                    dataKey={`${persona.name} - Wealth`}
                    stackId="wealth"
                    stroke={colors[`${persona.name} - Wealth`]}
                    fill={`url(#gradient-${persona.name} - Wealth)`}
                  />
                  <Area
                    key={`${persona.name}-tax`}
                    yAxisId="taxRate"
                    type="monotone"
                    dataKey={`${persona.name} - Tax Rate`}
                    stackId="taxRate"
                    stroke={colors[`${persona.name} - Tax Rate`]}
                    fill={`url(#gradient-${persona.name} - Tax Rate)`}
                  />
                </>
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default PersonaStackedAreaChart
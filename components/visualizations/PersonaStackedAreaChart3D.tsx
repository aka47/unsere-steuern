"use client"

import React, { useState, useMemo } from "react"
import { type Persona } from "@/types/persona"
import { type TaxScenario } from "@/types/life-income"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text, Html } from "@react-three/drei"
import * as d3 from "d3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PersonaCollectionStats } from "@/hooks/usePersonaCollectionCalculations"

interface DataPoint {
  year: number
  personaId: string
  personaName: string
  wealth: number
  taxRate: number
}

interface PersonaStackedAreaChart3DProps {
  personas: Persona[]
  personaStats: PersonaCollectionStats[]
}

export function PersonaStackedAreaChart3D({ personas, personaStats }: PersonaStackedAreaChart3DProps) {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null)
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

  // Color scales for the visualization
  const colorScales = useMemo(() => {
    return {
      wealth: d3.scaleSequential()
        .domain([minWealth, maxWealth])
        .interpolator(d3.interpolateBlues),
      taxRate: d3.scaleSequential()
        .domain([minTaxRate, maxTaxRate])
        .interpolator(d3.interpolateReds)
    }
  }, [minWealth, maxWealth, minTaxRate, maxTaxRate])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>3D Stacked Area Chart - Wealth & Tax Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] w-full">
          <Canvas camera={{ position: [15, 15, 15], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <StackedAreaChart3D
              data={data}
              personas={personas}
              years={years}
              colorScales={colorScales}
              minWealth={minWealth}
              maxWealth={maxWealth}
              minTaxRate={minTaxRate}
              maxTaxRate={maxTaxRate}
              onHover={setHoveredPoint}
            />
            <OrbitControls />
            <axesHelper args={[10]} />
            {hoveredPoint && (
              <Html
                position={[
                  years.indexOf(hoveredPoint.year) - years.length / 2,
                  (hoveredPoint.wealth / maxWealth) * 5,
                  personas.findIndex((p) => p.id === hoveredPoint.personaId) - personas.length / 2,
                ]}
                transform
                occlude
              >
                <div className="bg-white p-2 rounded shadow text-sm">
                  <div>
                    <strong>Persona:</strong> {hoveredPoint.personaName}
                  </div>
                  <div>
                    <strong>Year:</strong> {hoveredPoint.year}
                  </div>
                  <div>
                    <strong>Wealth:</strong>{" "}
                    {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(hoveredPoint.wealth)}
                  </div>
                  <div>
                    <strong>Tax Rate:</strong> {(hoveredPoint.taxRate * 100).toFixed(2)}%
                  </div>
                </div>
              </Html>
            )}
          </Canvas>
        </div>
        <div className="mt-4 flex justify-between">
          <div className="flex items-center">
            <div className="w-full h-4 bg-gradient-to-r from-blue-500 to-red-500"></div>
            <div className="flex justify-between w-full px-2">
              <span>
                {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(minWealth)}
              </span>
              <span>
                {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(maxWealth)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
function StackedAreaChart3D({
  data,
  personas,
  years,
  colorScales,
  minWealth,
  maxWealth,
  minTaxRate,
  maxTaxRate,
  onHover,
}: {
  data: DataPoint[]
  personas: Persona[]
  years: number[]
  colorScales: {
    wealth: d3.ScaleSequential<string>
    taxRate: d3.ScaleSequential<string>
  }
  minWealth: number
  maxWealth: number
  minTaxRate: number
  maxTaxRate: number
  onHover: (dataPoint: DataPoint | null) => void
}) {
  // Create a grid of data points for each persona
  const personaData = useMemo(() => {
    return personas.map(persona => {
      return years.map(year => {
        const point = data.find(d => d.personaId === persona.id && d.year === year)
        if (!point) return null
        return {
          ...point,
          normalizedWealth: (point.wealth - minWealth) / (maxWealth - minWealth),
          normalizedTaxRate: (point.taxRate - minTaxRate) / (maxTaxRate - minTaxRate)
        }
      })
    })
  }, [data, personas, years, minWealth, maxWealth, minTaxRate, maxTaxRate])

  return (
    <group position={[0, 0, 0]}>
      {/* Render stacked area charts for each persona */}
      {personaData.map((personaPoints, personaIndex) => {
        return (
          <group key={personaIndex} position={[0, 0, personaIndex - personas.length / 2]}>
            {/* Create the wealth area chart surface */}
            <mesh>
              <shape>
                {personaPoints.map((point, yearIndex) => {
                  if (!point) return null
                  const x = yearIndex - years.length / 2
                  const y = point.normalizedWealth * 5 // Scale height
                  return `M ${x} ${y} L ${x + 1} ${y}`
                }).filter(Boolean).join(' ')}
                {personaPoints.map((point, yearIndex) => {
                  if (!point) return null
                  const x = yearIndex - years.length / 2
                  const y = point.normalizedTaxRate * 5 // Stack tax rate on top
                  return `L ${x} ${y}`
                }).filter(Boolean).reverse().join(' ')}
                Z
              </shape>
              <meshStandardMaterial color={colorScales.wealth(personaPoints[0]?.wealth || 0)} transparent opacity={0.8} />
            </mesh>

            {/* Create the tax rate area chart surface */}
            <mesh>
              <shape>
                {personaPoints.map((point, yearIndex) => {
                  if (!point) return null
                  const x = yearIndex - years.length / 2
                  const y = point.normalizedTaxRate * 5 // Scale height
                  return `M ${x} ${y} L ${x + 1} ${y}`
                }).filter(Boolean).join(' ')}
                {personaPoints.map((point, yearIndex) => {
                  if (!point) return null
                  const x = yearIndex - years.length / 2
                  return `L ${x} 0`
                }).filter(Boolean).reverse().join(' ')}
                Z
              </shape>
              <meshStandardMaterial color={colorScales.taxRate(personaPoints[0]?.taxRate || 0)} transparent opacity={0.8} />
            </mesh>

            {/* Add points for interaction */}
            {personaPoints.map((point, yearIndex) => {
              if (!point) return null
              const x = yearIndex - years.length / 2
              const y = point.normalizedWealth * 5
              return (
                <mesh
                  key={`${personaIndex}-${yearIndex}`}
                  position={[x, y, 0]}
                  onPointerOver={() => onHover(point)}
                  onPointerOut={() => onHover(null)}
                >
                  <sphereGeometry args={[0.1]} />
                  <meshStandardMaterial color={colorScales.wealth(point.wealth)} />
                </mesh>
              )
            })}
          </group>
        )
      })}

      {/* X-axis (Years) */}
      <group position={[0, -0.1, -personas.length / 2 - 1]}>
        <Html position={[0, 1, 0]} transform>
          <div className="bg-white/90 p-2 rounded shadow text-sm">
            <strong>Years</strong>
            <div className="text-xs text-gray-600">Timeline of the visualization</div>
          </div>
        </Html>
        {years
          .filter((_, i) => i % 5 === 0)
          .map((year, i) => (
            <Text
              key={year}
              position={[i * 5 - years.length / 2, 0, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.5}
              color="black"
            >
              {year}
            </Text>
          ))}
      </group>

      {/* Z-axis (Personas) */}
      <group position={[-years.length / 2 - 1, -0.1, 0]}>
        <Html position={[0, 1, 0]} transform>
          <div className="bg-white/90 p-2 rounded shadow text-sm">
            <strong>Personas</strong>
            <div className="text-xs text-gray-600">Different population segments</div>
          </div>
        </Html>
        {personas.map((persona, i) => (
          <Text
            key={persona.id}
            position={[0, 0, i - personas.length / 2]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            fontSize={0.5}
            color="black"
          >
            {persona.name}
          </Text>
        ))}
      </group>

      {/* Y-axis (Metrics) */}
      <group position={[-years.length / 2 - 1, 0, -personas.length / 2 - 1]}>
        <Html position={[0, 2.5, 0]} transform>
          <div className="bg-white/90 p-2 rounded shadow text-sm">
            <strong>Wealth & Tax Rate</strong>
            <div className="text-xs text-gray-600">
              Blue = Wealth, Red = Tax Rate
            </div>
          </div>
        </Html>
        {[0, 1, 2, 3, 4, 5].map((val) => (
          <Text key={val} position={[0, val, 0]} fontSize={0.5} color="black">
            {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
              minWealth + (val / 5) * (maxWealth - minWealth),
            )}
          </Text>
        ))}
      </group>
    </group>
  )
}

export default PersonaStackedAreaChart3D

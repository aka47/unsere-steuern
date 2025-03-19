"use client"

import { useState, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text, Html } from "@react-three/drei"
import * as d3 from "d3"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Persona } from "@/types/persona"
import { PersonaCollectionStats } from "@/hooks/usePersonaCollectionCalculations"

interface DataPoint {
  year: number
  personaId: string
  personaName: string
  wealth: number
  income: number
  tax: number
  taxRate: number
}

interface PersonaAreaChart3DProps {
  personas: Persona[]
  personaStats: PersonaCollectionStats[]
}

export function PersonaAreaChart3D({ personas, personaStats }: PersonaAreaChart3DProps) {
  const [metric, setMetric] = useState<"wealth" | "income" | "tax" | "taxRate">("wealth")
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null)

  // Sort personas by their order in the original array
  const sortedPersonas = useMemo(() => {
    return [...personas].sort((a, b) => {
      const aIndex = personas.findIndex(p => p.id === a.id)
      const bIndex = personas.findIndex(p => p.id === b.id)
      return aIndex - bIndex
    })
  }, [personas])

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
          income: detail.income,
          tax: detail.incomeTax + detail.wealthTax + detail.vat + detail.inheritanceTax,
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

  // Get min and max values for the selected metric
  const { minValue, maxValue } = useMemo(() => {
    const values = data.map((d) => d[metric])
    return {
      minValue: Math.min(...values),
      maxValue: Math.max(...values),
    }
  }, [data, metric])

  // Color scale for the visualization
  const colorScale = useMemo(() => {
    return d3.scaleOrdinal<string>()
      .domain(sortedPersonas.map(p => p.id))
      .range(d3.schemeCategory10)
  }, [sortedPersonas])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>3D Area Chart - Persona Development</CardTitle>
          <Select value={metric} onValueChange={(value) => setMetric(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wealth">Wealth</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="tax">Tax</SelectItem>
              <SelectItem value="taxRate">Tax Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] w-full">
          <Canvas camera={{ position: [15, 15, 15], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <AreaChart3D
              data={data}
              personas={sortedPersonas}
              years={years}
              metric={metric}
              colorScale={colorScale}
              minValue={minValue}
              maxValue={maxValue}
              onHover={setHoveredPoint}
            />
            <OrbitControls />
            <axesHelper args={[10]} />
            {hoveredPoint && (
              <Html
                position={[
                  years.indexOf(hoveredPoint.year) - years.length / 2,
                  hoveredPoint[metric] * 0.1,
                  sortedPersonas.findIndex((p) => p.id === hoveredPoint.personaId) - sortedPersonas.length / 2,
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
                    <strong>{metric.charAt(0).toUpperCase() + metric.slice(1)}:</strong>{" "}
                    {(() => {
                      const value = hoveredPoint[metric as keyof DataPoint]
                      if (typeof value !== 'number') return ''
                      return metric === "taxRate"
                        ? `${(value * 100).toFixed(2)}%`
                        : new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value)
                    })()}
                  </div>
                </div>
              </Html>
            )}
          </Canvas>
        </div>
        <div className="mt-4 flex justify-between">
          <div className="flex items-center">
            <div className="w-full h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"></div>
            <div className="flex justify-between w-full px-2">
              <span>
                {metric === "taxRate"
                  ? `${(minValue * 100).toFixed(2)}%`
                  : new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(minValue)}
              </span>
              <span>
                {metric === "taxRate"
                  ? `${(maxValue * 100).toFixed(2)}%`
                  : new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(maxValue)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AreaChart3D({
  data,
  personas,
  years,
  metric,
  colorScale,
  minValue,
  maxValue,
  onHover,
}: {
  data: DataPoint[]
  personas: Persona[]
  years: number[]
  metric: string
  colorScale: d3.ScaleOrdinal<string, string>
  minValue: number
  maxValue: number
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
          normalizedValue: ((point[metric as keyof DataPoint] as number) - minValue) / (maxValue - minValue)
        }
      })
    })
  }, [data, personas, years, metric, minValue, maxValue])

  return (
    <group position={[0, 0, 0]}>
      {/* Render area charts for each persona */}
      {personaData.map((personaPoints, personaIndex) => {
        const color = colorScale(personas[personaIndex].id)

        return (
          <group key={personaIndex} position={[0, 0, personaIndex - personas.length / 2]}>
            {/* Create the area chart surface */}
            <mesh>
              <shape>
                {personaPoints.map((point, yearIndex) => {
                  if (!point) return null
                  const x = yearIndex - years.length / 2
                  const y = point.normalizedValue * 5 // Scale height
                  return `M ${x} ${y} L ${x + 1} ${y}`
                }).filter(Boolean).join(' ')}
                {personaPoints.map((point, yearIndex) => {
                  if (!point) return null
                  const x = yearIndex - years.length / 2
                  const y = point.normalizedValue * 5
                  return `L ${x} 0`
                }).filter(Boolean).reverse().join(' ')}
                Z
              </shape>
              <meshStandardMaterial color={color} transparent opacity={0.8} />
            </mesh>

            {/* Add points for interaction */}
            {personaPoints.map((point, yearIndex) => {
              if (!point) return null
              const x = yearIndex - years.length / 2
              const y = point.normalizedValue * 5
              return (
                <mesh
                  key={`${personaIndex}-${yearIndex}`}
                  position={[x, y, 0]}
                  onPointerOver={() => onHover(point)}
                  onPointerOut={() => onHover(null)}
                >
                  <sphereGeometry args={[0.1]} />
                  <meshStandardMaterial color={color} />
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

      {/* Y-axis (Metric) */}
      <group position={[-years.length / 2 - 1, 0, -personas.length / 2 - 1]}>
        <Html position={[0, 2.5, 0]} transform>
          <div className="bg-white/90 p-2 rounded shadow text-sm">
            <strong>{metric.charAt(0).toUpperCase() + metric.slice(1)}</strong>
            <div className="text-xs text-gray-600">
              {metric === "taxRate"
                ? "Effective tax rate as percentage"
                : metric === "wealth"
                ? "Total accumulated wealth"
                : metric === "income"
                ? "Annual income"
                : "Total tax paid"}
            </div>
          </div>
        </Html>
        {[0, 1, 2, 3, 4, 5].map((val) => (
          <Text key={val} position={[0, val, 0]} fontSize={0.5} color="black">
            {metric === "taxRate"
              ? `${((minValue + (val / 5) * (maxValue - minValue)) * 100).toFixed(0)}%`
              : new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
                  minValue + (val / 5) * (maxValue - minValue),
                )}
          </Text>
        ))}
      </group>
    </group>
  )
}

export default PersonaAreaChart3D
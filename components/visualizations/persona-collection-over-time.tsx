"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text, Html } from "@react-three/drei"
import * as d3 from "d3"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Persona } from "@/types/persona"
import { PersonaSegmentStats } from "@/hooks/usePersonaSegmentCalculator"
import { Tooltip as RechartsTooltip } from "recharts"

// Define the data structure for a single data point
interface DataPoint {
  year: number
  personaId: string
  personaName: string
  wealth: number
  income: number
  tax: number
  taxRate: number
}

// Props for the component
interface PersonaCollectionOverTimeProps {
  personas: Persona[]
  personaStats: PersonaSegmentStats[]
}

interface TooltipData {
  personaName: string
  year: number
  value: number
  metric: string
}

// Main component
export function PersonaCollectionOverTime({ personas, personaStats }: PersonaCollectionOverTimeProps) {
  const [metric, setMetric] = useState<"wealth" | "income" | "tax" | "taxRate">("wealth")
  const [_hoveredCell, setHoveredCell] = useState<DataPoint | null>(null)
  const [view, setView] = useState<"3d" | "2d">("3d")

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
        const year = 2024 - (65 - detail.age) // Calculate year based on age
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

  // Color scales for the visualization
  const colorScales = useMemo(() => {
    // Add some padding to the domain to create more contrast
    const domainPadding = (maxValue - minValue) * 0.1
    const paddedMin = Math.max(0, minValue - domainPadding)
    const paddedMax = maxValue + domainPadding

    return {
      "3d": d3.scaleSequential()
        .domain([paddedMin, paddedMax])
        .interpolator(d3.interpolateRdYlBu),
      "2d": d3.scaleSequential()
        .domain([paddedMin, paddedMax])
        .interpolator(d3.interpolateBlues)
    }
  }, [minValue, maxValue])

  const formatValue = (value: number, metric: string): string => {
    if (metric === "taxRate") {
      return `${(value * 100).toFixed(2)}%`
    }
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Persona Collection Over Time</CardTitle>
          <div className="flex space-x-4">
            <Tabs value={view} onValueChange={(v) => setView(v as "3d" | "2d")}>
              <TabsList>
                <TabsTrigger value="3d">3D View</TabsTrigger>
                <TabsTrigger value="2d">2D View</TabsTrigger>
              </TabsList>
            </Tabs>
            <Select
              value={metric}
              onValueChange={(value: "wealth" | "income" | "tax" | "taxRate") => setMetric(value)}
            >
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] w-full">
          {view === "3d" ? (
            <Canvas camera={{ position: [15, 15, 15], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Landscape
                data={data}
                personas={sortedPersonas}
                years={years}
                metric={metric}
                colorScale={colorScales["3d"]}
                minValue={minValue}
                maxValue={maxValue}
                onHover={setHoveredCell}
              />
              <OrbitControls />
              <axesHelper args={[10]} />
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as TooltipData
                    return (
                      <div className="bg-white p-2 rounded shadow text-sm">
                        <div>
                          <strong>Persona:</strong> {data.personaName}
                        </div>
                        <div>
                          <strong>Year:</strong> {data.year}
                        </div>
                        <div>
                          <strong>{data.metric}:</strong> {formatValue(data.value, data.metric)}
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </Canvas>
          ) : (
            <HeatmapView
              data={data}
              personas={sortedPersonas}
              years={years}
              metric={metric}
              colorScale={colorScales["2d"]}
              _minValue={minValue}
              _maxValue={maxValue}
            />
          )}
        </div>
        <div className="mt-4 flex justify-between">
          <div className="flex items-center">
            <div className={`w-full h-4 ${view === "3d" ? "bg-gradient-to-r from-red-600 via-yellow-400 to-blue-600" : "bg-gradient-to-r from-blue-50 via-blue-300 to-blue-900"}`}></div>
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

// 3D Landscape component
function Landscape({
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
  colorScale: d3.ScaleSequential<string>
  minValue: number
  maxValue: number
  onHover: (dataPoint: DataPoint | null) => void
}) {
  // Create a grid of cells for the landscape
  const cells = useMemo(() => {
    const grid: DataPoint[][] = []

    // Initialize the grid with empty arrays
    for (let i = 0; i < personas.length; i++) {
      grid[i] = []
    }

    // Fill the grid with data
    for (const point of data) {
      const personaIndex = personas.findIndex((p) => p.id === point.personaId)
      const yearIndex = years.indexOf(point.year)

      if (personaIndex !== -1 && yearIndex !== -1) {
        grid[personaIndex][yearIndex] = point
      }
    }

    return grid
  }, [data, personas, years])

  return (
    <group position={[0, 0, 0]}>
      {cells.map((row, personaIndex) => (
        <group key={personaIndex} position={[0, 0, personaIndex - personas.length / 2]}>
          {row.map((cell, yearIndex) => {
            if (!cell) return null

            const x = yearIndex - years.length / 2
            const y = (((cell[metric as keyof DataPoint] as number) - minValue) / (maxValue - minValue)) * 5 // Scale height
            const z = personaIndex - personas.length / 2

            return (
              <mesh
                key={`${personaIndex}-${yearIndex}`}
                position={[x, y / 2, z]}
                onPointerOver={() => onHover(cell)}
                onPointerOut={() => onHover(null)}
              >
                <boxGeometry args={[0.9, y || 0.01, 0.9]} />
                <meshStandardMaterial color={colorScale(cell[metric as keyof DataPoint] as number)} />
              </mesh>
            )
          })}
        </group>
      ))}

      {/* X-axis (Years) with tooltip */}
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

      {/* Z-axis (Personas) with tooltip */}
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

      {/* Y-axis (Metric) with tooltip */}
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

      {/* Legend tooltip */}
      <Html position={[years.length / 2 + 1, 2.5, 0]} transform>
        <div className="bg-white/90 p-2 rounded shadow text-sm">
          <strong>Color Scale</strong>
          <div className="text-xs text-gray-600">
            {metric === "taxRate"
              ? "Red = Higher tax rates, Blue = Lower tax rates"
              : "Red = Higher values, Blue = Lower values"}
          </div>
        </div>
      </Html>
    </group>
  )
}

// 2D Heatmap view
function HeatmapView({
  data,
  personas,
  years,
  metric,
  colorScale,
  _minValue,
  _maxValue,
}: {
  data: DataPoint[]
  personas: Persona[]
  years: number[]
  metric: string
  colorScale: d3.ScaleSequential<string>
  _minValue: number
  _maxValue: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [hoveredCell, setHoveredCell] = useState<DataPoint | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      })
    }
  }, [])

  // Create a grid of cells for the heatmap
  const grid = useMemo(() => {
    const result: (DataPoint | null)[][] = []

    // Initialize the grid with null values
    for (let i = 0; i < personas.length; i++) {
      result[i] = Array(years.length).fill(null)
    }

    // Fill the grid with data
    for (const point of data) {
      const personaIndex = personas.findIndex((p) => p.id === point.personaId)
      const yearIndex = years.indexOf(point.year)

      if (personaIndex !== -1 && yearIndex !== -1) {
        result[personaIndex][yearIndex] = point
      }
    }

    return result
  }, [data, personas, years])

  const cellWidth = dimensions.width / years.length
  const cellHeight = dimensions.height / personas.length

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {dimensions.width > 0 && (
        <>
          {/* Year labels (top) */}
          <div className="absolute top-0 left-0 right-0 flex">
            {years
              .filter((_, i) => i % 5 === 0)
              .map((year, i) => (
                <div
                  key={year}
                  className="text-xs absolute"
                  style={{
                    left: `${i * 5 * cellWidth + cellWidth / 2}px`,
                    transform: "translateX(-50%)",
                  }}
                >
                  {year}
                </div>
              ))}
          </div>

          {/* Persona labels (left) */}
          <div className="absolute top-0 left-0 bottom-0">
            {personas.map((persona, i) => (
              <div
                key={persona.id}
                className="text-xs absolute flex items-center"
                style={{
                  top: `${i * cellHeight + cellHeight / 2}px`,
                  transform: "translateY(-50%)",
                  maxWidth: "100px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {persona.name}
              </div>
            ))}
          </div>

          {/* Heatmap cells */}
          <div className="absolute top-20 left-100 right-0 bottom-0">
            {grid.map((row, personaIndex) => (
              <div key={personaIndex} className="flex">
                {row.map((cell, yearIndex) => (
                  <div
                    key={`${personaIndex}-${yearIndex}`}
                    className="border border-gray-100"
                    style={{
                      width: `${cellWidth}px`,
                      height: `${cellHeight}px`,
                      backgroundColor: cell ? colorScale(cell[metric as keyof DataPoint] as number) : "#f0f0f0",
                    }}
                    onMouseEnter={() => cell && setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Tooltip */}
          {hoveredCell && (
            <div
              className="absolute bg-white p-2 rounded shadow text-sm z-10"
              style={{
                left: `${years.indexOf(hoveredCell.year) * cellWidth + cellWidth}px`,
                top: `${personas.findIndex((p) => p.id === hoveredCell.personaId) * cellHeight + cellHeight}px`,
              }}
            >
              <div>
                <strong>Persona:</strong> {hoveredCell.personaName}
              </div>
              <div>
                <strong>Year:</strong> {hoveredCell.year}
              </div>
              <div>
                <strong>{metric.charAt(0).toUpperCase() + metric.slice(1)}:</strong>{" "}
                {(() => {
                  const value = hoveredCell[metric as keyof DataPoint]
                  if (typeof value !== 'number') return ''
                  return metric === "taxRate"
                    ? `${(value * 100).toFixed(2)}%`
                    : new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value)
                })()}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PersonaCollectionOverTime
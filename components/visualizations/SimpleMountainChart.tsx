"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Persona } from "@/types/persona"
import { PersonaSegmentStats } from "@/hooks/usePersonaSegmentCalculator"

interface DataPoint {
  year: number
  personaId: string
  personaName: string
  income: number
}

interface PersonaDataPoint {
  year: number
  income: number
}

interface PersonaData {
  id: string
  name: string
  values: PersonaDataPoint[]
}

interface SimpleMountainChartProps {
  personas: Persona[]
  personaStats: PersonaSegmentStats[]
}

export function SimpleMountainChart({ personas, personaStats }: SimpleMountainChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [debug, setDebug] = useState<string>("")

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
          income: detail.income
        })
      })
    })

    return dataPoints
  }, [personaStats])

  useEffect(() => {
    if (!svgRef.current || !personas.length || !data.length) {
      setDebug("Missing required data or refs")
      return
    }

    try {
      // Clear previous chart
      d3.select(svgRef.current).selectAll("*").remove()

      const width = 800
      const height = 400
      const margin = { top: 20, right: 30, bottom: 30, left: 40 }
      const innerWidth = width - margin.left - margin.right
      const innerHeight = height - margin.top - margin.bottom

      // Create SVG
      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)

      // Group data by persona
      const personaData: PersonaData[] = personas.map((persona) => {
        const personaPoints = data.filter((d) => d.personaId === persona.id)
        return {
          id: persona.id,
          name: persona.name,
          values: personaPoints.map((d) => ({
            year: d.year,
            income: d.income,
          })),
        }
      })

      // Create scales
      const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.year) as [number, number])
        .range([0, innerWidth])

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.income) as number])
        .range([innerHeight, 0])

      // Create line generator
      const line = d3
        .line<PersonaDataPoint>()
        .x((d) => xScale(d.year))
        .y((d) => yScale(d.income))
        .curve(d3.curveBasis)

      // Create color scale
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(personas.map((p) => p.id))

      // Add lines
      svg
        .selectAll(".line")
        .data(personaData)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("d", (d) => line(d.values))
        .attr("fill", "none")
        .attr("stroke", (d) => colorScale(d.id) as string)
        .attr("stroke-width", 2)

      // Add axes
      const xAxis = d3.axisBottom(xScale)
        .tickFormat(d => d.toString())
        .ticks(10)

      const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0
        }).format(d as number))

      svg.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)")

      svg.append("g")
        .call(yAxis)

      // Add legend
      const legend = svg
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(personaData)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(0,${i * 20})`)

      legend
        .append("rect")
        .attr("x", innerWidth - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", (d) => colorScale(d.id) as string)

      legend
        .append("text")
        .attr("x", innerWidth - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text((d) => d.name)

      setDebug("Simple chart rendered successfully")
    } catch (error) {
      setDebug(`Error rendering simple chart: ${error}`)
    }
  }, [personas, data])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Income Development</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <svg ref={svgRef} width="800" height="400"></svg>
        </div>
        {debug && <div className="mt-2 p-2 bg-gray-100 text-xs font-mono">Debug: {debug}</div>}
      </CardContent>
    </Card>
  )
}

export default SimpleMountainChart


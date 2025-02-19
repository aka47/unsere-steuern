"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    month: "Jan",
    flatTax: 45000,
    progressive: 42000,
    lifetime: 38000,
  },
  {
    month: "Feb",
    flatTax: 47000,
    progressive: 44000,
    lifetime: 42000,
  },
  // Add more monthly data...
]

export function TaxScenarioChart() {
  return (
    <ChartContainer
      config={{
        flatTax: {
          label: "Flat Tax",
          color: "hsl(var(--chart-1))",
        },
        progressive: {
          label: "Progressive",
          color: "hsl(var(--chart-2))",
        },
        lifetime: {
          label: "Lebenseinkommen",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[350px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}€`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="flatTax" stroke="var(--color-flatTax)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="progressive" stroke="var(--color-progressive)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="lifetime" stroke="var(--color-lifetime)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}


"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface LifetimeChartProps {
  data: {
    yearlyData: Array<{
      age: number
      income: number
      wealth: number
      taxesPaid: number
    }>
  }
}

export function LifetimeChart({ data }: LifetimeChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data.yearlyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="age" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#8884d8" name="Income" />
        <Line type="monotone" dataKey="wealth" stroke="#82ca9d" name="Wealth" />
        <Line type="monotone" dataKey="taxesPaid" stroke="#ffc658" name="Taxes Paid" />
      </LineChart>
    </ResponsiveContainer>
  )
}


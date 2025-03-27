import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string | ReactNode
  content?: string | ReactNode
  suffix?: string
}

export function StatCard({ title, value, description, content, suffix }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          {value}{suffix}
        </p>
        {content && (
          <p className="text-sm text-muted-foreground">{content}</p>
        )}
      </CardContent>
    </Card>
  )
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  description?: React.ReactNode
  suffix?: string
}

export function StatCard({ title, value, description, suffix }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          {value}{suffix}
        </p>
        {description && (
          <div className="text-sm text-muted-foreground">{description}</div>
        )}
      </CardContent>
    </Card>
  )
}
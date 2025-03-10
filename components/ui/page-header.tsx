"use client"

import { ReactNode } from "react"
import { TypographyH3, TypographyMuted } from "@/components/ui/typography"

interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: ReactNode
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <header className="flex min-h-16 items-center gap-4 border-b bg-muted/40 px-6 py-4 h-[80px]">
      <div className="flex-1">
        <TypographyH3>{title}</TypographyH3>
        {subtitle && <TypographyMuted>{subtitle}</TypographyMuted>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </header>
  )
}
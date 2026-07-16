"use client"

import { motion } from "framer-motion"
import {
  AlertCircle,
  AlertTriangle,
  Gauge,
  ShieldCheck,
  TrendingDown,
  Users,
} from "lucide-react"
import type { DashboardSummary } from "@/lib/dashboard-data"
import type { RiskLevel } from "@/lib/calculate-risk"
import { AnimatedNumber } from "@/components/animated-number"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CardConfig {
  id: string
  label: string
  value: number
  suffix?: string
  icon: React.ComponentType<{ className?: string }>
  accent: string
  iconWrap: string
  filter?: RiskLevel | "all"
  sub?: string
}

export function DashboardCards({
  summary,
  activeFilter,
  onFilterClick,
}: {
  summary: DashboardSummary
  activeFilter?: string
  onFilterClick?: (filter: RiskLevel | "all") => void
}) {
  const cards: CardConfig[] = [
    {
      id: "total",
      label: "Total Merchants",
      value: summary.total,
      icon: Users,
      accent: "text-foreground",
      iconWrap: "bg-primary/10 text-primary",
      filter: "all",
      sub: "Active portfolio",
    },
    {
      id: "high",
      label: "High Risk",
      value: summary.high,
      icon: AlertTriangle,
      accent: "text-danger",
      iconWrap: "bg-danger/10 text-danger",
      filter: "High",
      sub: `${formatCurrency(summary.highRiskRevenue)} at stake`,
    },
    {
      id: "medium",
      label: "Medium Risk",
      value: summary.medium,
      icon: AlertCircle,
      accent: "text-warning-foreground",
      iconWrap: "bg-warning/20 text-warning-foreground",
      filter: "Medium",
    },
    {
      id: "low",
      label: "Low Risk",
      value: summary.low,
      icon: ShieldCheck,
      accent: "text-success",
      iconWrap: "bg-success/10 text-success",
      filter: "Low",
    },
    {
      id: "avg",
      label: "Avg Risk Score",
      value: summary.averageScore,
      icon: Gauge,
      accent: "text-foreground",
      iconWrap: "bg-primary/10 text-primary",
      sub: `${summary.atRiskCount} need attention`,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((card, i) => {
        const isActive = card.filter && activeFilter === card.filter
        const isClickable = !!onFilterClick && !!card.filter

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card
              className={cn(
                "transition-all duration-200",
                isClickable && "cursor-pointer hover:shadow-md hover:ring-primary/20",
                isActive && "ring-2 ring-primary shadow-md",
              )}
              onClick={isClickable ? () => onFilterClick(card.filter!) : undefined}
            >
              <CardContent className="flex flex-col gap-2 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
                  <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", card.iconWrap)}>
                    <card.icon className="h-3.5 w-3.5" />
                  </span>
                </div>
                <AnimatedNumber value={card.value} className={cn("text-2xl font-bold tracking-tight tabular-nums", card.accent)} />
                {card.sub && (
                  <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    {card.id === "high" && <TrendingDown className="h-3 w-3 text-danger" />}
                    {card.sub}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

function formatCurrency(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
  return `₹${value.toLocaleString("en-IN")}`
}

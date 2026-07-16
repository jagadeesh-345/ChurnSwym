"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import type { ScoredMerchant } from "@/lib/calculate-risk"
import { RiskBadge } from "@/components/risk-badge"
import { Sparkline } from "@/components/sparkline"
import { getMerchantRevenueTrend } from "@/lib/trends"
import { cn } from "@/lib/utils"

function formatCurrency(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
  return `₹${value.toLocaleString("en-IN")}`
}

export function MerchantRow({
  merchant,
  index,
  onSelect,
  isSelected,
}: {
  merchant: ScoredMerchant
  index: number
  onSelect: (merchant: ScoredMerchant) => void
  isSelected?: boolean
}) {
  const revenueTrend = getMerchantRevenueTrend(merchant.id, merchant.monthlyRevenue)
  const topFactors = merchant.factors.slice(0, 2)

  const scoreColor =
    merchant.riskLevel === "High"
      ? "text-danger"
      : merchant.riskLevel === "Medium"
        ? "text-warning-foreground"
        : "text-success"

  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025, duration: 0.3 }}
      onClick={() => onSelect(merchant)}
      className={cn(
        "group cursor-pointer border-b border-border transition-colors",
        isSelected ? "bg-primary/5" : "hover:bg-accent/50",
      )}
    >
      <td className="whitespace-nowrap px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
            {merchant.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-foreground">{merchant.name}</div>
            <div className="text-xs text-muted-foreground">{merchant.category} · {merchant.plan}</div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-right text-sm tabular-nums text-foreground">
        {formatCurrency(merchant.monthlyRevenue)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-right text-sm tabular-nums text-muted-foreground">
        {merchant.ordersLast30Days}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-right text-sm tabular-nums text-muted-foreground">
        {merchant.daysSinceLastLogin}d
      </td>
      <td className="hidden whitespace-nowrap px-4 py-3.5 md:table-cell">
        <Sparkline data={revenueTrend} width={64} height={24} showArea={false} />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-bold tabular-nums", scoreColor)}>{merchant.riskScore}</span>
          <RiskBadge level={merchant.riskLevel} />
        </div>
      </td>
      <td className="hidden max-w-[200px] px-4 py-3.5 lg:table-cell">
        {topFactors.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {topFactors.map((f) => (
              <span
                key={f.label}
                className="inline-flex rounded-md bg-danger/8 px-1.5 py-0.5 text-[10px] font-medium text-danger"
              >
                {f.label}
              </span>
            ))}
            {merchant.factors.length > 2 && (
              <span className="text-[10px] text-muted-foreground">+{merchant.factors.length - 2}</span>
            )}
          </div>
        ) : (
          <span className="text-xs text-success">Healthy</span>
        )}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <div className="flex items-center justify-end gap-1">
          <span className="hidden text-xs text-muted-foreground group-hover:inline xl:inline">
            View analysis
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
        </div>
      </td>
    </motion.tr>
  )
}

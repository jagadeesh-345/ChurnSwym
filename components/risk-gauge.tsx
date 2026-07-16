"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { RiskLevel } from "@/lib/calculate-risk"

const RISK_COLORS: Record<RiskLevel, string> = {
  Low: "var(--color-success)",
  Medium: "var(--color-warning)",
  High: "var(--color-danger)",
}

export function RiskGauge({
  score,
  level,
  size = 72,
  strokeWidth = 6,
  className,
}: {
  score: number
  level: RiskLevel
  size?: number
  strokeWidth?: number
  className?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = RISK_COLORS[level]

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold tabular-nums leading-none" style={{ color }}>{score}</span>
        <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">score</span>
      </div>
    </div>
  )
}

"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import type { TrendPoint } from "@/lib/trends"

export function Sparkline({
  data,
  className,
  color = "var(--color-primary)",
  height = 32,
  width = 80,
  showArea = true,
}: {
  data: TrendPoint[]
  className?: string
  color?: string
  height?: number
  width?: number
  showArea?: boolean
}) {
  const path = useMemo(() => {
    if (data.length < 2) return { line: "", area: "" }

    const values = data.map((d) => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    const padding = 2

    const points = values.map((v, i) => {
      const x = padding + (i / (values.length - 1)) * (width - padding * 2)
      const y = padding + (1 - (v - min) / range) * (height - padding * 2)
      return { x, y }
    })

    const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")
    const area = `${line} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`

    return { line, area }
  }, [data, height, width])

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      aria-hidden
    >
      {showArea && path.area && (
        <path d={path.area} fill={color} fillOpacity={0.12} />
      )}
      <path
        d={path.line}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

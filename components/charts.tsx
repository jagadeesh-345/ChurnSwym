"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts"
import type { ScoredMerchant } from "@/lib/calculate-risk"
import type { RiskLevel } from "@/lib/calculate-risk"
import { getRiskDistribution, getAverageScoreByCategory } from "@/lib/dashboard-data"
import { getPortfolioRiskTrend } from "@/lib/trends"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChartSkeleton } from "@/components/chart-skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const RISK_COLORS: Record<string, string> = {
  Low: "var(--color-success)",
  Medium: "var(--color-warning)",
  High: "var(--color-danger)",
}

export function Charts({
  merchants,
  activeRiskFilter,
  onRiskSegmentClick,
}: {
  merchants: ScoredMerchant[]
  activeRiskFilter?: string
  onRiskSegmentClick?: (level: RiskLevel | "All") => void
}) {
  const distribution = getRiskDistribution(merchants)
  const byCategory = getAverageScoreByCategory(merchants)
  const portfolioTrend = getPortfolioRiskTrend(merchants)

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Risk distribution */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Click a segment to filter merchants</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                Low: { label: "Low", color: "var(--chart-2)" },
                Medium: { label: "Medium", color: "var(--chart-3)" },
                High: { label: "High", color: "var(--chart-4)" },
              }}
              className="mx-auto h-52 w-full"
            >
              {mounted ? (
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <Pie
                    data={distribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={78}
                    paddingAngle={3}
                    stroke="var(--color-card)"
                    strokeWidth={2}
                    animationBegin={200}
                    animationDuration={800}
                  >
                    {distribution.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={RISK_COLORS[entry.name]}
                        className={cn(
                          "cursor-pointer transition-opacity",
                          activeRiskFilter && activeRiskFilter !== "All" && activeRiskFilter !== entry.name && "opacity-40",
                        )}
                        onClick={() => onRiskSegmentClick?.(entry.name as RiskLevel)}
                      />
                    ))}
                  </Pie>
                </PieChart>
              ) : (
                <ChartSkeleton />
              )}
            </ChartContainer>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              {distribution.map((entry) => (
                <button
                  key={entry.name}
                  type="button"
                  onClick={() => onRiskSegmentClick?.(entry.name as RiskLevel)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors hover:bg-accent",
                    activeRiskFilter === entry.name && "bg-accent font-medium",
                  )}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: RISK_COLORS[entry.name] }} />
                  <span className="text-muted-foreground">
                    {entry.name} ({entry.value})
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.4 }}
        className="lg:col-span-1"
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Risk by Category</CardTitle>
            <CardDescription>Average score across business verticals</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ averageScore: { label: "Avg Risk Score", color: "var(--chart-1)" } }}
              className="h-52 w-full"
            >
              {mounted ? (
                <BarChart data={byCategory.slice(0, 6)} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    tickFormatter={(v: string) => (v.length > 8 ? `${v.slice(0, 7)}…` : v)}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="averageScore"
                    fill="var(--color-chart-1)"
                    radius={[4, 4, 0, 0]}
                    animationDuration={800}
                    animationBegin={300}
                  />
                </BarChart>
              ) : (
                <ChartSkeleton />
              )}
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Portfolio trend */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.29, duration: 0.4 }}
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Portfolio Risk Trend</CardTitle>
            <CardDescription>Average risk score over 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ value: { label: "Avg Score", color: "var(--chart-4)" } }}
              className="h-52 w-full"
            >
              {mounted ? (
                <LineChart data={portfolioTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-chart-4)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "var(--color-chart-4)" }}
                    animationDuration={1000}
                    animationBegin={400}
                  />
                </LineChart>
              ) : (
                <ChartSkeleton />
              )}
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

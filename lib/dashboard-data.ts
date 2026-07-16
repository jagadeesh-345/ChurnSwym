import { merchants } from "./merchants"
import { calculateRisk, getRiskLevel, type ScoredMerchant, type RiskLevel } from "./calculate-risk"
import { getRecommendedAction } from "./recommendations"

/** Scores every merchant once; downstream views derive everything from this. */
export function getScoredMerchants(): ScoredMerchant[] {
  return merchants.map((merchant) => {
    const { score, factors } = calculateRisk(merchant)
    const riskLevel = getRiskLevel(score)
    return {
      ...merchant,
      riskScore: score,
      riskLevel,
      factors,
      recommendedAction: getRecommendedAction(riskLevel, merchant.id),
    }
  })
}

export interface DashboardSummary {
  total: number
  high: number
  medium: number
  low: number
  averageScore: number
  highRiskRevenue: number
  atRiskCount: number
}

export function getSummary(scored: ScoredMerchant[]): DashboardSummary {
  const total = scored.length
  const counts: Record<RiskLevel, number> = { High: 0, Medium: 0, Low: 0 }
  let scoreSum = 0
  let highRiskRevenue = 0

  for (const m of scored) {
    counts[m.riskLevel] += 1
    scoreSum += m.riskScore
    if (m.riskLevel === "High") highRiskRevenue += m.monthlyRevenue
  }

  return {
    total,
    high: counts.High,
    medium: counts.Medium,
    low: counts.Low,
    averageScore: total === 0 ? 0 : Math.round(scoreSum / total),
    highRiskRevenue,
    atRiskCount: counts.High + counts.Medium,
  }
}

export function getRiskDistribution(scored: ScoredMerchant[]) {
  const summary = getSummary(scored)
  return [
    { name: "Low", value: summary.low, fill: "var(--color-success)" },
    { name: "Medium", value: summary.medium, fill: "var(--color-warning)" },
    { name: "High", value: summary.high, fill: "var(--color-danger)" },
  ]
}

export function getAverageScoreByCategory(scored: ScoredMerchant[]) {
  const groups = new Map<string, { sum: number; count: number }>()
  for (const m of scored) {
    const group = groups.get(m.category) ?? { sum: 0, count: 0 }
    group.sum += m.riskScore
    group.count += 1
    groups.set(m.category, group)
  }
  return Array.from(groups.entries())
    .map(([category, { sum, count }]) => ({
      category,
      averageScore: Math.round(sum / count),
      merchantCount: count,
    }))
    .sort((a, b) => b.averageScore - a.averageScore)
}

export function getUniqueCategories(scored: ScoredMerchant[]): string[] {
  return [...new Set(scored.map((m) => m.category))].sort()
}

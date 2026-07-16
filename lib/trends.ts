import type { ScoredMerchant } from "./calculate-risk"

export interface TrendPoint {
  label: string
  value: number
}

/** Deterministic pseudo-random from a string seed. */
function seedFromString(str: string): number {
  return str.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

function seededNoise(seed: number, index: number): number {
  const x = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453
  return x - Math.floor(x)
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

/** Six-month revenue trend anchored to current monthly revenue. */
export function getMerchantRevenueTrend(merchantId: string, baseRevenue: number): TrendPoint[] {
  const seed = seedFromString(merchantId)
  const trendDirection = seededNoise(seed, 0) > 0.55 ? 1 : -1
  const volatility = 0.08 + seededNoise(seed, 1) * 0.12

  return MONTH_LABELS.map((label, i) => {
    const monthsAgo = MONTH_LABELS.length - 1 - i
    const drift = trendDirection * monthsAgo * baseRevenue * 0.04
    const noise = (seededNoise(seed, i + 2) - 0.5) * baseRevenue * volatility
    const value = Math.max(0, Math.round(baseRevenue + drift + noise))
    return { label, value }
  })
}

/** Weekly login frequency over the last 6 weeks (higher = healthier). */
export function getMerchantLoginTrend(merchantId: string, daysSinceLastLogin: number): TrendPoint[] {
  const seed = seedFromString(merchantId)
  const baseLogins = Math.max(1, 7 - Math.floor(daysSinceLastLogin / 5))

  return Array.from({ length: 6 }, (_, i) => {
    const weeksAgo = 5 - i
    const decay = weeksAgo * (daysSinceLastLogin > 14 ? 0.8 : 0.2)
    const noise = (seededNoise(seed, i + 10) - 0.5) * 2
    const value = Math.max(0, Math.round(baseLogins - decay + noise))
    return { label: `W${i + 1}`, value }
  })
}

/** Portfolio-level average risk score trend (simulated historical view). */
export function getPortfolioRiskTrend(merchants: ScoredMerchant[]): TrendPoint[] {
  const currentAvg =
    merchants.length === 0
      ? 0
      : merchants.reduce((sum, m) => sum + m.riskScore, 0) / merchants.length

  return MONTH_LABELS.map((label, i) => {
    const monthsAgo = MONTH_LABELS.length - 1 - i
    const drift = monthsAgo * 1.8
    const value = Math.round(Math.min(100, Math.max(0, currentAvg + drift - 3)))
    return { label, value }
  })
}

/** Sparkline trend delta as percentage change (first → last point). */
export function getTrendDelta(points: TrendPoint[]): number {
  if (points.length < 2 || points[0].value === 0) return 0
  const first = points[0].value
  const last = points[points.length - 1].value
  return Math.round(((last - first) / first) * 100)
}

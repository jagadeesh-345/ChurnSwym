export type RiskLevel = "Low" | "Medium" | "High"

export type RiskFactorCategory =
  | "activity"
  | "revenue"
  | "orders"
  | "support"
  | "satisfaction"

export interface Merchant {
  id: string
  name: string
  category: string
  plan: string
  accountAgeMonths: number
  monthlyRevenue: number
  ordersLast30Days: number
  daysSinceLastLogin: number
  supportTickets: number
  npsScore: number
  assignedRep: string
  lastContactDaysAgo: number
}

export interface RiskFactor {
  label: string
  points: number
  maxPoints: number
  category: RiskFactorCategory
  description: string
}

export interface ScoredMerchant extends Merchant {
  riskScore: number
  riskLevel: RiskLevel
  factors: RiskFactor[]
  recommendedAction: string
}

/**
 * Explainable, rule-based churn risk scoring.
 * Each signal contributes a fixed number of points. The total is capped at 100.
 * Returning the individual factors keeps the score transparent for CS teams.
 */
export function calculateRisk(merchant: Merchant): { score: number; factors: RiskFactor[] } {
  const factors: RiskFactor[] = []

  if (merchant.daysSinceLastLogin > 14) {
    factors.push({
      label: "Account inactivity",
      points: 30,
      maxPoints: 30,
      category: "activity",
      description: `No login for ${merchant.daysSinceLastLogin} days — threshold is 14 days`,
    })
  }
  if (merchant.ordersLast30Days < 20) {
    factors.push({
      label: "Low order volume",
      points: 20,
      maxPoints: 20,
      category: "orders",
      description: `Only ${merchant.ordersLast30Days} orders in 30 days — healthy baseline is 20+`,
    })
  }
  if (merchant.monthlyRevenue < 10000) {
    factors.push({
      label: "Revenue decline risk",
      points: 15,
      maxPoints: 15,
      category: "revenue",
      description: `Monthly revenue ₹${merchant.monthlyRevenue.toLocaleString("en-IN")} is below ₹10,000 threshold`,
    })
  }
  if (merchant.supportTickets > 3) {
    factors.push({
      label: "Support escalation",
      points: 20,
      maxPoints: 20,
      category: "support",
      description: `${merchant.supportTickets} open tickets — more than 3 indicates unresolved friction`,
    })
  }
  if (merchant.npsScore < 6) {
    factors.push({
      label: "Low satisfaction",
      points: 15,
      maxPoints: 15,
      category: "satisfaction",
      description: `NPS score of ${merchant.npsScore} — promoters typically score 7+`,
    })
  }

  const rawScore = factors.reduce((sum, f) => sum + f.points, 0)
  const score = Math.min(rawScore, 100)

  return { score, factors }
}

/** Risk levels are derived dynamically from the computed score. */
export function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return "High"
  if (score >= 40) return "Medium"
  return "Low"
}

export const RISK_THRESHOLDS = {
  high: 70,
  medium: 40,
} as const

export const FACTOR_CATEGORY_LABELS: Record<RiskFactorCategory, string> = {
  activity: "Engagement",
  revenue: "Revenue",
  orders: "Order Volume",
  support: "Support Health",
  satisfaction: "Satisfaction",
}

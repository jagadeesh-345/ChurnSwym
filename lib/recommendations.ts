import type { RiskLevel } from "./calculate-risk"

const ACTIONS: Record<RiskLevel, string[]> = {
  High: ["Schedule Customer Success Call", "Offer Promotional Discount", "Assign Priority Support"],
  Medium: ["Send Product Education Email", "Schedule Product Demo", "Share Best Practices"],
  Low: ["No Immediate Action", "Upsell Premium Features", "Invite to Beta Programs"],
}

/**
 * Deterministically pick a recommended next action for a merchant based on its
 * risk level. Uses the merchant id as a stable seed so the same merchant always
 * maps to the same action within its tier.
 */
export function getRecommendedAction(riskLevel: RiskLevel, seed: string): string {
  const options = ACTIONS[riskLevel]
  const numericSeed = seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return options[numericSeed % options.length]
}

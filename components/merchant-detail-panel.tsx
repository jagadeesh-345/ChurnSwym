"use client"

import { motion } from "framer-motion"
import {
  Activity,
  Calendar,
  Clock,
  IndianRupee,
  Mail,
  MessageSquare,
  Phone,
  ShoppingCart,
  Star,
  Ticket,
  User,
  X,
} from "lucide-react"
import type { ScoredMerchant } from "@/lib/calculate-risk"
import { FACTOR_CATEGORY_LABELS, RISK_THRESHOLDS } from "@/lib/calculate-risk"
import {
  getMerchantLoginTrend,
  getMerchantRevenueTrend,
  getTrendDelta,
} from "@/lib/trends"
import { RiskGauge } from "@/components/risk-gauge"
import { RiskBadge } from "@/components/risk-badge"
import { Sparkline } from "@/components/sparkline"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function formatCurrency(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
  return `₹${value.toLocaleString("en-IN")}`
}

function MetricTile({
  icon: Icon,
  label,
  value,
  sub,
  alert,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  sub?: string
  alert?: boolean
}) {
  return (
    <div className={cn("rounded-lg border p-3", alert ? "border-danger/30 bg-danger/5" : "border-border bg-muted/30")}>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className={cn("mt-1 text-lg font-semibold tabular-nums", alert && "text-danger")}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

export function MerchantDetailPanel({
  merchant,
  onClose,
}: {
  merchant: ScoredMerchant | null
  onClose: () => void
}) {
  const revenueTrend = merchant ? getMerchantRevenueTrend(merchant.id, merchant.monthlyRevenue) : []
  const loginTrend = merchant ? getMerchantLoginTrend(merchant.id, merchant.daysSinceLastLogin) : []
  const revenueDelta = getTrendDelta(revenueTrend)

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: merchant ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm",
          !merchant && "pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: merchant ? 0 : "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-border bg-card shadow-2xl"
        aria-hidden={!merchant}
      >
        {merchant && (
          <>
            <div className="flex items-start justify-between border-b border-border px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">{merchant.name}</h2>
                  <RiskBadge level={merchant.riskLevel} />
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {merchant.id} · {merchant.category} · {merchant.plan}
                </p>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close panel">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Risk overview */}
              <section className="border-b border-border px-6 py-5">
                <div className="flex items-center gap-5">
                  <RiskGauge score={merchant.riskScore} level={merchant.riskLevel} size={88} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Churn Risk Assessment</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {merchant.factors.length === 0
                        ? "All health signals are within normal range. This merchant shows strong retention indicators."
                        : `${merchant.factors.length} risk signal${merchant.factors.length > 1 ? "s" : ""} detected contributing ${merchant.riskScore} points.`}
                    </p>
                    <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                      <span>Low &lt; {RISK_THRESHOLDS.medium}</span>
                      <span>Medium {RISK_THRESHOLDS.medium}–{RISK_THRESHOLDS.high - 1}</span>
                      <span>High ≥ {RISK_THRESHOLDS.high}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Explainable factors */}
              <section className="border-b border-border px-6 py-5">
                <h3 className="text-sm font-semibold text-foreground">Risk Factor Breakdown</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Transparent scoring — each factor adds fixed points to the total
                </p>

                {merchant.factors.length === 0 ? (
                  <div className="mt-4 flex items-center gap-3 rounded-lg border border-success/30 bg-success/5 p-4">
                    <Activity className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-sm font-medium text-success">Healthy account</p>
                      <p className="text-xs text-muted-foreground">No risk factors triggered</p>
                    </div>
                  </div>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {merchant.factors.map((factor, i) => (
                      <motion.li
                        key={factor.label}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.3 }}
                        className="rounded-lg border border-border bg-muted/20 p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-foreground">{factor.label}</p>
                            <p className="text-xs text-muted-foreground">{FACTOR_CATEGORY_LABELS[factor.category]}</p>
                          </div>
                          <span className="shrink-0 rounded-md bg-danger/10 px-2 py-0.5 text-xs font-bold tabular-nums text-danger">
                            +{factor.points}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{factor.description}</p>
                        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className="h-full rounded-full bg-danger"
                            initial={{ width: 0 }}
                            animate={{ width: `${(factor.points / factor.maxPoints) * 100}%` }}
                            transition={{ delay: 0.2 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Health metrics */}
              <section className="border-b border-border px-6 py-5">
                <h3 className="text-sm font-semibold text-foreground">Account Health</h3>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <MetricTile icon={IndianRupee} label="Monthly Revenue" value={formatCurrency(merchant.monthlyRevenue)} />
                  <MetricTile icon={ShoppingCart} label="Orders (30d)" value={String(merchant.ordersLast30Days)} alert={merchant.ordersLast30Days < 20} />
                  <MetricTile icon={Clock} label="Last Login" value={`${merchant.daysSinceLastLogin}d ago`} alert={merchant.daysSinceLastLogin > 14} />
                  <MetricTile icon={Ticket} label="Open Tickets" value={String(merchant.supportTickets)} alert={merchant.supportTickets > 3} />
                  <MetricTile icon={Star} label="NPS Score" value={String(merchant.npsScore)} alert={merchant.npsScore < 6} />
                  <MetricTile icon={Calendar} label="Account Age" value={`${merchant.accountAgeMonths} mo`} />
                </div>
              </section>

              {/* Trends */}
              <section className="border-b border-border px-6 py-5">
                <h3 className="text-sm font-semibold text-foreground">Trends</h3>
                <div className="mt-3 space-y-3">
                  <div className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Revenue (6 mo)</span>
                      <span className={cn("text-xs font-medium tabular-nums", revenueDelta >= 0 ? "text-success" : "text-danger")}>
                        {revenueDelta >= 0 ? "+" : ""}{revenueDelta}%
                      </span>
                    </div>
                    <Sparkline data={revenueTrend} className="mt-2 h-8 w-full" width={400} height={32} color="var(--color-primary)" />
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Weekly Logins</span>
                      <span className="text-xs text-muted-foreground">Last 6 weeks</span>
                    </div>
                    <Sparkline
                      data={loginTrend}
                      className="mt-2 h-8 w-full"
                      width={400}
                      height={32}
                      color={merchant.daysSinceLastLogin > 14 ? "var(--color-danger)" : "var(--color-success)"}
                    />
                  </div>
                </div>
              </section>

              {/* CS info + recommendation */}
              <section className="px-6 py-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  Assigned to {merchant.assignedRep} · Last contact {merchant.lastContactDaysAgo}d ago
                </div>
                <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">Recommended Action</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{merchant.recommendedAction}</p>
                </div>
              </section>
            </div>

            {/* Action bar */}
            <div className="flex gap-2 border-t border-border px-6 py-4">
              <Button className="flex-1 gap-1.5" size="sm">
                <Phone className="h-3.5 w-3.5" />
                Schedule Call
              </Button>
              <Button variant="outline" className="flex-1 gap-1.5" size="sm">
                <Mail className="h-3.5 w-3.5" />
                Send Email
              </Button>
              <Button variant="outline" size="icon-sm" aria-label="Add note">
                <MessageSquare className="h-3.5 w-3.5" />
              </Button>
            </div>
          </>
        )}
      </motion.aside>
    </>
  )
}

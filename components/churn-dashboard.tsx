"use client"

import { useMemo, useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import type { ScoredMerchant, RiskLevel } from "@/lib/calculate-risk"
import { getSummary, getUniqueCategories } from "@/lib/dashboard-data"
import { AppShell } from "@/components/app-shell"
import { DashboardCards } from "@/components/dashboard-cards"
import { Charts } from "@/components/charts"
import { SearchBar } from "@/components/search-bar"
import { Filters, type RiskFilter } from "@/components/filters"
import { MerchantTable, type SortKey, type SortDir } from "@/components/merchant-table"
import { MerchantDetailPanel } from "@/components/merchant-detail-panel"

export function ChurnDashboard({ merchants }: { merchants: ScoredMerchant[] }) {
  const [search, setSearch] = useState("")
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("All")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [sortKey, setSortKey] = useState<SortKey>("riskScore")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [selectedMerchant, setSelectedMerchant] = useState<ScoredMerchant | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const categories = useMemo(() => getUniqueCategories(merchants), [merchants])
  const summary = useMemo(() => getSummary(merchants), [merchants])
  const highRiskCount = summary.high

  const visibleMerchants = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = merchants.filter((m) => {
      const matchesSearch =
        query === "" ||
        m.name.toLowerCase().includes(query) ||
        m.id.toLowerCase().includes(query) ||
        m.category.toLowerCase().includes(query)
      const matchesRisk = riskFilter === "All" || m.riskLevel === riskFilter
      const matchesCategory = categoryFilter === "All" || m.category === categoryFilter
      return matchesSearch && matchesRisk && matchesCategory
    })

    return [...filtered].sort((a, b) => {
      const diff = a[sortKey] - b[sortKey]
      return sortDir === "asc" ? diff : -diff
    })
  }, [merchants, search, riskFilter, categoryFilter, sortKey, sortDir])

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  const handleRiskFilter = useCallback((filter: RiskLevel | "all") => {
    setRiskFilter(filter === "all" ? "All" : filter)
  }, [])

  const handleChartSegmentClick = useCallback((level: RiskLevel | "All") => {
    setRiskFilter(level === "All" ? "All" : level)
  }, [])

  const handleExport = useCallback(() => {
    const headers = ["ID", "Name", "Category", "Plan", "Revenue", "Orders", "Last Login", "Tickets", "NPS", "Risk Score", "Risk Level"]
    const rows = visibleMerchants.map((m) =>
      [m.id, m.name, m.category, m.plan, m.monthlyRevenue, m.ordersLast30Days, m.daysSinceLastLogin, m.supportTickets, m.npsScore, m.riskScore, m.riskLevel].join(","),
    )
    const csv = [headers.join(","), ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "merchant-churn-report.csv"
    a.click()
    URL.revokeObjectURL(url)
    setToast("Report exported successfully")
    setTimeout(() => setToast(null), 3000)
  }, [visibleMerchants])

  return (
    <AppShell alertCount={highRiskCount}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Churn Risk Dashboard
              </h1>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Monitor merchant health with explainable risk scoring. Identify at-risk accounts and take proactive retention actions.
              </p>
            </div>
            <div className="hidden items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary sm:flex">
              <Sparkles className="h-3.5 w-3.5" />
              {summary.atRiskCount} accounts need attention
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <DashboardCards
            summary={summary}
            activeFilter={riskFilter}
            onFilterClick={handleRiskFilter}
          />

          <Charts
            merchants={merchants}
            activeRiskFilter={riskFilter}
            onRiskSegmentClick={handleChartSegmentClick}
          />

          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">Merchant Portfolio</h2>
                <p className="text-sm text-muted-foreground">
                  Click any row for a full risk analysis breakdown
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <SearchBar value={search} onChange={setSearch} />
                <Filters
                  value={riskFilter}
                  onChange={setRiskFilter}
                  categories={categories}
                  categoryValue={categoryFilter}
                  onCategoryChange={setCategoryFilter}
                />
              </div>
            </div>

            <MerchantTable
              merchants={visibleMerchants}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
              onSelect={setSelectedMerchant}
              selectedId={selectedMerchant?.id}
              onExport={handleExport}
            />
          </section>
        </div>
      </div>

      <AnimatePresence>
        {selectedMerchant && (
          <MerchantDetailPanel
            merchant={selectedMerchant}
            onClose={() => setSelectedMerchant(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  )
}

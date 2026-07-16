"use client"

import { motion } from "framer-motion"
import { ArrowUpDown, ArrowUp, ArrowDown, SearchX, Download } from "lucide-react"
import type { ScoredMerchant } from "@/lib/calculate-risk"
import { MerchantRow } from "@/components/merchant-row"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type SortKey =
  | "accountAgeMonths"
  | "monthlyRevenue"
  | "ordersLast30Days"
  | "daysSinceLastLogin"
  | "supportTickets"
  | "npsScore"
  | "riskScore"

export type SortDir = "asc" | "desc"

interface Column {
  key: SortKey | null
  label: string
  align: "left" | "right"
  className?: string
}

const COLUMNS: Column[] = [
  { key: null, label: "Merchant", align: "left" },
  { key: "monthlyRevenue", label: "Revenue", align: "right" },
  { key: "ordersLast30Days", label: "Orders", align: "right" },
  { key: "daysSinceLastLogin", label: "Last Login", align: "right" },
  { key: null, label: "Trend", align: "left", className: "hidden md:table-cell" },
  { key: "riskScore", label: "Risk", align: "left" },
  { key: null, label: "Signals", align: "left", className: "hidden lg:table-cell" },
  { key: null, label: "", align: "right" },
]

export function MerchantTable({
  merchants,
  sortKey,
  sortDir,
  onSort,
  onSelect,
  selectedId,
  onExport,
}: {
  merchants: ScoredMerchant[]
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
  onSelect: (merchant: ScoredMerchant) => void
  selectedId?: string
  onExport?: () => void
}) {
  return (
    <Card className="overflow-hidden py-0">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{merchants.length}</span> merchants
        </p>
        {onExport && (
          <Button variant="outline" size="xs" className="gap-1.5" onClick={onExport}>
            <Download className="h-3 w-3" />
            Export CSV
          </Button>
        )}
      </div>

      <div className="max-h-[520px] overflow-auto">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm">
            <tr className="border-b border-border">
              {COLUMNS.map((col, i) => {
                const isSorted = col.key !== null && col.key === sortKey
                return (
                  <th
                    key={`${col.label}-${i}`}
                    scope="col"
                    className={cn(
                      "px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
                      col.align === "right" ? "text-right" : "text-left",
                      col.className,
                    )}
                  >
                    {col.key ? (
                      <button
                        type="button"
                        onClick={() => onSort(col.key as SortKey)}
                        className={cn(
                          "inline-flex items-center gap-1 transition hover:text-foreground",
                          col.align === "right" && "flex-row-reverse",
                          isSorted && "text-foreground",
                        )}
                      >
                        {col.label}
                        {isSorted ? (
                          sortDir === "asc" ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-40" />
                        )}
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {merchants.map((merchant, i) => (
              <MerchantRow
                key={merchant.id}
                merchant={merchant}
                index={i}
                onSelect={onSelect}
                isSelected={selectedId === merchant.id}
              />
            ))}
          </tbody>
        </table>

        {merchants.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center gap-3 py-20 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <SearchX className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">No merchants match your filters</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Try adjusting search, risk level, or category</p>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  )
}

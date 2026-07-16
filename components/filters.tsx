"use client"

import type { RiskLevel } from "@/lib/calculate-risk"
import { cn } from "@/lib/utils"

export type RiskFilter = "All" | RiskLevel

const OPTIONS: { value: RiskFilter; dot?: string }[] = [
  { value: "All" },
  { value: "High", dot: "bg-danger" },
  { value: "Medium", dot: "bg-warning" },
  { value: "Low", dot: "bg-success" },
]

export function Filters({
  value,
  onChange,
  categories,
  categoryValue,
  onCategoryChange,
}: {
  value: RiskFilter
  onChange: (value: RiskFilter) => void
  categories?: string[]
  categoryValue?: string
  onCategoryChange?: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5" role="group" aria-label="Filter by risk level">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200",
              value === option.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {option.dot && <span className={cn("h-1.5 w-1.5 rounded-full", option.dot)} />}
            {option.value}
          </button>
        ))}
      </div>

      {categories && onCategoryChange && (
        <select
          value={categoryValue ?? "All"}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Filter by category"
          className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
        >
          <option value="All">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      )}
    </div>
  )
}

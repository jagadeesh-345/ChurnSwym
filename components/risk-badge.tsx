import type { RiskLevel } from "@/lib/calculate-risk"
import { cn } from "@/lib/utils"

const STYLES: Record<RiskLevel, string> = {
  Low: "bg-success/12 text-success ring-success/20",
  Medium: "bg-warning/15 text-warning-foreground ring-warning/25",
  High: "bg-danger/12 text-danger ring-danger/20",
}

const DOT_STYLES: Record<RiskLevel, string> = {
  Low: "bg-success shadow-[0_0_6px_var(--color-success)]",
  Medium: "bg-warning shadow-[0_0_6px_var(--color-warning)]",
  High: "bg-danger shadow-[0_0_6px_var(--color-danger)]",
}

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
        STYLES[level],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", DOT_STYLES[level])} />
      {level}
    </span>
  )
}

import { cn } from "@/lib/utils"

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full w-full flex-col gap-3", className)}>
      <div className="flex flex-1 items-end gap-2 pb-2">
        {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
          <div
            key={i}
            className="flex-1 animate-pulse rounded-sm bg-muted"
            style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-2 w-6 animate-pulse rounded bg-muted" style={{ animationDelay: `${i * 60}ms` }} />
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
        <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="mt-4 h-8 w-16 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-6 w-24 animate-pulse rounded bg-muted" />
    </div>
  )
}

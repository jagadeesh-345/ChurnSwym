import { ChurnDashboard } from "@/components/churn-dashboard"
import { getScoredMerchants } from "@/lib/dashboard-data"

export default function Page() {
  const merchants = getScoredMerchants()
  return <ChurnDashboard merchants={merchants} />
}

import { Wallet, CreditCard, Hourglass, AlertCircle } from 'lucide-react'
import StatCard from '@/components/ui/StatCard'
import { formatMoney } from '@/utils/formatters'

const SummaryCards = ({ totals }) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard
      label="My Total Share"
      value={formatMoney(totals.myShare)}
      hint="Across confirmed expenses"
      icon={Wallet}
      tone="rose"
    />
    <StatCard
      label="Paid"
      value={formatMoney(totals.paid)}
      hint={`${totals.myShare ? Math.round((totals.paid / totals.myShare) * 100) : 0}% of my share`}
      icon={CreditCard}
      tone="emerald"
    />
    <StatCard
      label="Outstanding"
      value={formatMoney(totals.outstanding)}
      hint="Remaining to pay"
      icon={Hourglass}
      tone="amber"
    />
    <StatCard
      label="Pending / TBC"
      value={totals.pendingCount}
      hint="Rows without final amount"
      icon={AlertCircle}
      tone="sky"
    />
  </div>
)

export default SummaryCards

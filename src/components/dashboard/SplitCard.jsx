import { Users } from 'lucide-react'
import { formatMoney } from '@/utils/formatters'

const SplitCard = ({ split }) => {
  const total = split.total || 1
  const mePct      = Math.round((split.me      / total) * 100)
  const partnerPct = 100 - mePct

  return (
    <div className="card">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-rose-600" />
        <h3 className="text-lg">Who pays what</h3>
      </div>

      <p className="mt-1 text-xs text-slate-500">
        Based on share type — Shared rows are split 50/50, Non-Shared land on you.
      </p>

      <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="bg-rose-500" style={{ width: `${mePct}%` }} />
        <div className="bg-slate-300" style={{ width: `${partnerPct}%` }} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-rose-50 p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-700">My side</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">{formatMoney(split.me)}</div>
          <div className="text-xs text-slate-500">{mePct}% of total</div>
        </div>
        <div className="rounded-xl bg-slate-100 p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-600">Partner side</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">{formatMoney(split.partner)}</div>
          <div className="text-xs text-slate-500">{partnerPct}% of total</div>
        </div>
      </div>
    </div>
  )
}

export default SplitCard

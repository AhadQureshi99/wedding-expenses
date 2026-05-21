import { Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatMoney, shareTypeLabel } from '@/utils/formatters'

const statusTone = { confirmed: 'emerald', tbc: 'amber', pending: 'sky' }

const ExpenseTable = ({ expenses, onEdit, onDelete, onTogglePaid }) => {
  if (expenses.length === 0) {
    return (
      <div className="card text-center text-sm text-slate-500">
        No expenses match the current filters.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">Event</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Supplier</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-left">Share</th>
              <th className="px-4 py-3 text-right">My share</th>
              <th className="px-4 py-3 text-right">Paid</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((e) => {
              const paidFull = e.is_fully_paid
              return (
                <tr key={e.id} className="hover:bg-rose-50/30">
                  <td className="px-4 py-3 font-medium text-slate-900">{e.event}</td>
                  <td className="px-4 py-3 text-slate-600">{e.category}</td>
                  <td className="px-4 py-3 text-slate-600">{e.supplier}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatMoney(e.total_actual)}</td>
                  <td className="px-4 py-3 text-slate-600">{shareTypeLabel(e.share_type)}</td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums">{formatMoney(e.my_share)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => onTogglePaid(e)}
                        className="text-slate-400 hover:text-rose-700"
                        title={paidFull ? 'Mark as not fully paid' : 'Mark as fully paid'}
                      >
                        {paidFull
                          ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          : <Circle className="h-4 w-4" />}
                      </button>
                      <span className="text-slate-700">{formatMoney(e.paid_amount)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge tone={statusTone[e.status]}>{e.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => onEdit(e)} className="btn-ghost p-1.5" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => onDelete(e)} className="btn-ghost p-1.5 hover:text-red-600" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ExpenseTable

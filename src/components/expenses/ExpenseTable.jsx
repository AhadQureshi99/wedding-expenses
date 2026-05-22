import { Pencil, Trash2, CheckCircle2, Circle, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatMoney, shareTypeLabel } from '@/utils/formatters'

const statusTone = { confirmed: 'emerald', tbc: 'amber', pending: 'sky' }

const SortHeader = ({ label, columnKey, align = 'left', sort, onSort }) => {
  const active = sort?.key === columnKey
  const dir = active ? sort.dir : null

  const alignClass = align === 'right'
    ? 'justify-end'
    : align === 'center'
      ? 'justify-center'
      : 'justify-start'

  const Icon = !active ? ChevronsUpDown : dir === 'asc' ? ChevronUp : ChevronDown

  return (
    <th className={`px-4 py-3 text-${align}`}>
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        className={`inline-flex items-center gap-1 ${alignClass} w-full uppercase tracking-wider text-xs font-semibold transition ${
          active ? 'text-rose-700' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <span>{label}</span>
        <Icon className={`h-3.5 w-3.5 ${active ? '' : 'text-slate-300'}`} />
      </button>
    </th>
  )
}

const ExpenseTable = ({
  expenses,
  onEdit,
  onDelete,
  onTogglePaid,
  readOnly = false,
  sort,
  onSort,
}) => {
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
          <thead className="bg-slate-50">
            <tr>
              <SortHeader label="Event"     columnKey="event"        sort={sort} onSort={onSort} />
              <SortHeader label="Category"  columnKey="category"     sort={sort} onSort={onSort} />
              <SortHeader label="Supplier"  columnKey="supplier"     sort={sort} onSort={onSort} />
              <SortHeader label="Total"     columnKey="total_actual" sort={sort} onSort={onSort} align="right" />
              <SortHeader label="Share"     columnKey="share_type"   sort={sort} onSort={onSort} />
              <SortHeader label="My share"  columnKey="my_share"     sort={sort} onSort={onSort} align="right" />
              <SortHeader label="Paid"      columnKey="paid_amount"  sort={sort} onSort={onSort} align="right" />
              <SortHeader label="Status"    columnKey="status"       sort={sort} onSort={onSort} align="center" />
              {!readOnly && <th className="px-4 py-3" />}
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
                      {readOnly ? (
                        paidFull
                          ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          : <Circle className="h-4 w-4 text-slate-300" />
                      ) : (
                        <button
                          onClick={() => onTogglePaid(e)}
                          className="text-slate-400 hover:text-rose-700"
                          title={paidFull ? 'Mark as not fully paid' : 'Mark as fully paid'}
                        >
                          {paidFull
                            ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            : <Circle className="h-4 w-4" />}
                        </button>
                      )}
                      <span className="text-slate-700">{formatMoney(e.paid_amount)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge tone={statusTone[e.status]}>{e.status}</Badge>
                  </td>
                  {!readOnly && (
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
                  )}
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

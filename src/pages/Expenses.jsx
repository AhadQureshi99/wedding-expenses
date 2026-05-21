import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useExpenses } from '@/hooks/useExpenses'
import ExpenseFilters from '@/components/expenses/ExpenseFilters'
import ExpenseTable from '@/components/expenses/ExpenseTable'
import ExpenseForm from '@/components/expenses/ExpenseForm'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import { formatMoney } from '@/utils/formatters'
import { computeTotals } from '@/utils/calculations'

const DEFAULT_FILTERS = { search: '', event: '', category: '', status: '' }

const Expenses = () => {
  const { expenses, loading, create, update, remove } = useExpenses()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return expenses.filter((e) => {
      if (q && !e.supplier.toLowerCase().includes(q)) return false
      if (filters.event    && e.event    !== filters.event)    return false
      if (filters.category && e.category !== filters.category) return false
      if (filters.status   && e.status   !== filters.status)   return false
      return true
    })
  }, [expenses, filters])

  const filteredTotals = useMemo(() => computeTotals(filtered), [filtered])

  const openCreate = () => { setEditing(null); setShowForm(true) }
  const openEdit   = (e) => { setEditing(e);   setShowForm(true) }
  const closeForm  = () => { setShowForm(false); setEditing(null) }

  const onSubmit = async (payload) => {
    setBusy(true)
    const { error } = editing
      ? await update(editing.id, payload)
      : await create(payload)
    setBusy(false)
    if (error) {
      alert(error.message)
      return
    }
    closeForm()
  }

  const onTogglePaid = async (e) => {
    const next = !e.is_fully_paid
    await update(e.id, {
      is_fully_paid: next,
      paid_amount: next ? (e.my_share ?? e.paid_amount ?? 0) : e.paid_amount,
    })
  }

  const onConfirmDelete = async () => {
    if (!deleting) return
    setBusy(true)
    await remove(deleting.id)
    setBusy(false)
    setDeleting(null)
  }

  if (loading) {
    return <div className="grid place-items-center py-24"><Spinner /></div>
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl">Expenses</h1>
          <p className="text-sm text-slate-500">
            {filtered.length} of {expenses.length} • {formatMoney(filteredTotals.myShare)} my share
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" /> Add expense
        </button>
      </div>

      <ExpenseFilters filters={filters} onChange={setFilters} />

      <ExpenseTable
        expenses={filtered}
        onEdit={openEdit}
        onDelete={setDeleting}
        onTogglePaid={onTogglePaid}
      />

      <Modal
        open={showForm}
        onClose={closeForm}
        title={editing ? 'Edit expense' : 'New expense'}
        maxWidth="max-w-xl"
      >
        <ExpenseForm
          initial={editing}
          onSubmit={onSubmit}
          onCancel={closeForm}
          busy={busy}
        />
      </Modal>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete expense?"
        footer={
          <>
            <button onClick={() => setDeleting(null)} className="btn-secondary">Cancel</button>
            <button onClick={onConfirmDelete} disabled={busy} className="btn-danger">Delete</button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold">{deleting?.supplier}</span>? This can't be undone.
        </p>
      </Modal>
    </div>
  )
}

export default Expenses

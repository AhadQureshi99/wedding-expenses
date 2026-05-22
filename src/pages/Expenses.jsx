import { useMemo, useState } from 'react'
import { Plus, Download, Upload } from 'lucide-react'
import { useExpenses } from '@/hooks/useExpenses'
import ExpenseFilters from '@/components/expenses/ExpenseFilters'
import ExpenseTable from '@/components/expenses/ExpenseTable'
import ExpenseForm from '@/components/expenses/ExpenseForm'
import ImportExcelModal from '@/components/expenses/ImportExcelModal'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import { formatMoney } from '@/utils/formatters'
import { computeTotals } from '@/utils/calculations'
import { exportToExcel } from '@/utils/excel'
import { sortExpenses, nextSort } from '@/utils/sort'

const DEFAULT_FILTERS = { search: '', event: '', category: '', status: '' }
const DEFAULT_SORT = { key: null, dir: 'asc' }

const Expenses = () => {
  const {
    expenses, loading, create, update, remove,
    bulkInsert, replaceAll, readOnly,
  } = useExpenses()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sort, setSort] = useState(DEFAULT_SORT)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)
  const [exporting, setExporting] = useState(false)

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

  const sorted = useMemo(() => sortExpenses(filtered, sort.key, sort.dir), [filtered, sort])
  const onSort = (key) => setSort((s) => nextSort(s, key))

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
    // Only flip the flag. paid_amount is preserved — edit it via the modal if you need to change it.
    await update(e.id, { is_fully_paid: !e.is_fully_paid })
  }

  const onConfirmDelete = async () => {
    if (!deleting) return
    setBusy(true)
    await remove(deleting.id)
    setBusy(false)
    setDeleting(null)
  }

  const onExport = async () => {
    setExporting(true)
    try {
      const stamp = new Date().toISOString().slice(0, 10)
      await exportToExcel(expenses, `wedding-expenses-${stamp}.xlsx`)
    } catch (err) {
      alert(err.message || 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  const onImport = async (rows, mode) => {
    return mode === 'replace' ? replaceAll(rows) : bulkInsert(rows)
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

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onExport}
            disabled={exporting || expenses.length === 0}
            className="btn-secondary"
            title="Download all expenses as .xlsx"
          >
            <Download className="h-4 w-4" /> Export
          </button>
          {!readOnly && (
            <>
              <button onClick={() => setShowImport(true)} className="btn-secondary">
                <Upload className="h-4 w-4" /> Import
              </button>
              <button onClick={openCreate} className="btn-primary">
                <Plus className="h-4 w-4" /> Add expense
              </button>
            </>
          )}
        </div>
      </div>

      <ExpenseFilters filters={filters} onChange={setFilters} />

      <ExpenseTable
        expenses={sorted}
        readOnly={readOnly}
        sort={sort}
        onSort={onSort}
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

      <ImportExcelModal
        open={showImport}
        onClose={() => setShowImport(false)}
        onImport={onImport}
      />

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

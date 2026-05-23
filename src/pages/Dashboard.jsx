import { useMemo, useState } from 'react'
import { Download, Loader2, Eye } from 'lucide-react'
import { useExpenses } from '@/hooks/useExpenses'
import { useAuth } from '@/context/AuthContext'
import { useViewer } from '@/context/ViewerContext'
import {
  computeTotals,
  groupByEvent,
  groupByCategory,
  computePartnerShare,
} from '@/utils/calculations'
import SummaryCards from '@/components/dashboard/SummaryCards'
import EventBreakdown from '@/components/dashboard/EventBreakdown'
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown'
import SplitCard from '@/components/dashboard/SplitCard'
import Spinner from '@/components/ui/Spinner'
import { SEED_EXPENSES } from '@/data/seedExpenses'
import { ADMIN_NAME } from '@/constants'

const Dashboard = () => {
  const { expenses, loading, bulkInsert } = useExpenses()
  const { isAdmin } = useAuth()
  const { viewerMode } = useViewer()
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState(null)

  const totals = useMemo(() => computeTotals(expenses),       [expenses])
  const events = useMemo(() => groupByEvent(expenses),        [expenses])
  const cats   = useMemo(() => groupByCategory(expenses),     [expenses])
  const split  = useMemo(() => computePartnerShare(expenses), [expenses])

  const importStarterData = async () => {
    setImporting(true)
    setImportError(null)
    const { error } = await bulkInsert(SEED_EXPENSES)
    setImporting(false)
    if (error) setImportError(error.message)
  }

  if (loading) {
    return <div className="grid place-items-center py-24"><Spinner /></div>
  }

  if (expenses.length === 0) {
    // Already in viewer mode but admin's account is empty
    if (viewerMode) {
      return (
        <div className="card text-center">
          <h2 className="text-2xl">No expenses yet</h2>
          <p className="mt-2 text-slate-600">{ADMIN_NAME} hasn't added any expenses yet.</p>
        </div>
      )
    }

    // Signed-in non-admin — gently point them at the PIN viewer
    if (!isAdmin) {
      return (
        <div className="mx-auto max-w-lg">
          <div className="card text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-50">
              <Eye className="h-5 w-5 text-rose-600" />
            </div>
            <h2 className="mt-3 text-2xl">{ADMIN_NAME}'s wedding tracker</h2>
            <p className="mt-2 text-slate-600">
              This is a private expense tracker. Use the{' '}
              <span className="font-semibold">View {ADMIN_NAME}'s</span> button at the top
              and enter the 4-digit PIN to see the expenses.
            </p>
          </div>
        </div>
      )
    }

    // Admin, empty — offer to seed
    return (
      <div className="mx-auto max-w-lg">
        <div className="card text-center">
          <h2 className="text-2xl">Welcome 🎉</h2>
          <p className="mt-2 text-slate-600">
            Import the wedding expenses from your spreadsheet, or start fresh.
          </p>

          <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button onClick={importStarterData} disabled={importing} className="btn-primary">
              {importing
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Download className="h-4 w-4" />}
              Import starter data ({SEED_EXPENSES.length} rows)
            </button>
            <a href="/expenses" className="btn-secondary">Start blank</a>
          </div>

          {importError && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{importError}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Dashboard</h1>
        <p className="text-sm text-slate-500">
          {expenses.length} expense{expenses.length === 1 ? '' : 's'} tracked
        </p>
      </div>

      <SummaryCards totals={totals} />

      <div className="grid gap-4 lg:grid-cols-2">
        <EventBreakdown data={events} />
        <CategoryBreakdown data={cats} />
      </div>

      <SplitCard split={split} />
    </div>
  )
}

export default Dashboard

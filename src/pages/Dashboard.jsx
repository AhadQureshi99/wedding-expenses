import { useMemo } from 'react'
import { useExpenses } from '@/hooks/useExpenses'
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

const Dashboard = () => {
  const { expenses, loading } = useExpenses()

  const totals  = useMemo(() => computeTotals(expenses),       [expenses])
  const events  = useMemo(() => groupByEvent(expenses),        [expenses])
  const cats    = useMemo(() => groupByCategory(expenses),     [expenses])
  const split   = useMemo(() => computePartnerShare(expenses), [expenses])

  if (loading) {
    return <div className="grid place-items-center py-24"><Spinner /></div>
  }

  if (expenses.length === 0) {
    return (
      <div className="card text-center">
        <h2 className="text-2xl">Welcome 🎉</h2>
        <p className="mt-2 text-slate-600">
          No expenses yet. Head to <a href="/expenses" className="text-rose-600 underline">Expenses</a> to add your first one.
        </p>
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

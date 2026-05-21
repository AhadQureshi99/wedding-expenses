import { Search } from 'lucide-react'
import { EVENTS, CATEGORIES, STATUSES } from '@/constants'

const ExpenseFilters = ({ filters, onChange }) => {
  const set = (k, v) => onChange({ ...filters, [k]: v })

  return (
    <div className="card grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          placeholder="Search supplier…"
          className="input pl-9"
        />
      </div>

      <select className="input" value={filters.event} onChange={(e) => set('event', e.target.value)}>
        <option value="">All events</option>
        {EVENTS.map((e) => <option key={e} value={e}>{e}</option>)}
      </select>

      <select className="input" value={filters.category} onChange={(e) => set('category', e.target.value)}>
        <option value="">All categories</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <select className="input" value={filters.status} onChange={(e) => set('status', e.target.value)}>
        <option value="">All statuses</option>
        {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>
    </div>
  )
}

export default ExpenseFilters

import { useEffect, useState } from 'react'
import { EVENTS, CATEGORIES, SHARE_TYPES, STATUSES } from '@/constants'

const EMPTY = {
  event: 'Maiyaan',
  category: 'Food',
  supplier: '',
  total_actual: '',
  share_type: 'shared_50',
  my_share: '',
  paid_amount: '',
  is_fully_paid: false,
  status: 'confirmed',
  notes: '',
}

const toNum = (v) => (v === '' || v == null ? null : Number(v))

const ExpenseForm = ({ initial, onSubmit, onCancel, busy }) => {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (initial) {
      setForm({
        ...EMPTY,
        ...initial,
        total_actual: initial.total_actual ?? '',
        my_share:     initial.my_share     ?? '',
        paid_amount:  initial.paid_amount  ?? '',
        notes:        initial.notes        ?? '',
      })
    } else {
      setForm(EMPTY)
    }
  }, [initial])

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  useEffect(() => {
    const total = toNum(form.total_actual)
    if (total == null) return
    const expected = form.share_type === 'shared_50' ? total / 2 : total
    setForm((f) => ({ ...f, my_share: expected }))
  }, [form.total_actual, form.share_type])

  const submit = (e) => {
    e.preventDefault()
    onSubmit({
      event: form.event,
      category: form.category,
      supplier: form.supplier.trim(),
      total_actual: toNum(form.total_actual),
      share_type: form.share_type,
      my_share: toNum(form.my_share),
      paid_amount: toNum(form.paid_amount) ?? 0,
      is_fully_paid: !!form.is_fully_paid,
      status: form.status,
      notes: form.notes?.trim() || null,
    })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Event</label>
          <select className="input" value={form.event} onChange={(e) => set({ event: e.target.value })}>
            {EVENTS.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Category</label>
          <select className="input" value={form.category} onChange={(e) => set({ category: e.target.value })}>
            {CATEGORIES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Supplier</label>
        <input
          required
          className="input"
          value={form.supplier}
          onChange={(e) => set({ supplier: e.target.value })}
          placeholder="e.g. Big Tree Décor"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Total (actual)</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            className="input"
            value={form.total_actual}
            onChange={(e) => set({ total_actual: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="label">Share type</label>
          <select className="input" value={form.share_type} onChange={(e) => set({ share_type: e.target.value })}>
            {SHARE_TYPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">My share</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            className="input"
            value={form.my_share}
            onChange={(e) => set({ my_share: e.target.value })}
            placeholder="Auto from total"
          />
        </div>
        <div>
          <label className="label">Paid so far</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            className="input"
            value={form.paid_amount}
            onChange={(e) => set({ paid_amount: e.target.value })}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={(e) => set({ status: e.target.value })}>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <label className="mt-6 flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
            checked={form.is_fully_paid}
            onChange={(e) => set({ is_fully_paid: e.target.checked })}
          />
          Fully paid
        </label>
      </div>

      <div>
        <label className="label">Notes</label>
        <textarea
          rows={2}
          className="input"
          value={form.notes}
          onChange={(e) => set({ notes: e.target.value })}
          placeholder="Optional"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={busy} className="btn-primary">
          {initial ? 'Save changes' : 'Add expense'}
        </button>
      </div>
    </form>
  )
}

export default ExpenseForm

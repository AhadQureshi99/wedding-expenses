const CURRENCY = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
})

const CURRENCY_PRECISE = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 2,
})

export const formatMoney = (value, { precise = false } = {}) => {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return (precise ? CURRENCY_PRECISE : CURRENCY).format(Number(value))
}

export const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const shareTypeLabel = (value) =>
  value === 'shared_50' ? 'Shared 50/50' : 'Non-Shared'

export const statusLabel = (value) =>
  ({ confirmed: 'Confirmed', tbc: 'TBC', pending: 'Pending' })[value] ?? value

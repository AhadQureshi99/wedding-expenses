/**
 * Pure aggregations over the expense list. No React, no Supabase — easy to test.
 */

const num = (v) => (v == null || Number.isNaN(Number(v)) ? 0 : Number(v))

export const computeTotals = (expenses) => {
  let actual = 0
  let myShare = 0
  let paid = 0
  let pendingCount = 0

  for (const e of expenses) {
    actual += num(e.total_actual)
    myShare += num(e.my_share)
    paid += num(e.paid_amount)
    if (e.status !== 'confirmed' || e.total_actual == null) pendingCount += 1
  }

  return {
    actual,
    myShare,
    paid,
    outstanding: Math.max(myShare - paid, 0),
    pendingCount,
  }
}

const groupBy = (expenses, key) => {
  const map = new Map()
  for (const e of expenses) {
    const bucket = map.get(e[key]) ?? { actual: 0, myShare: 0, paid: 0, count: 0 }
    bucket.actual  += num(e.total_actual)
    bucket.myShare += num(e.my_share)
    bucket.paid    += num(e.paid_amount)
    bucket.count   += 1
    map.set(e[key], bucket)
  }
  return Array.from(map, ([name, v]) => ({ name, ...v }))
}

export const groupByEvent    = (expenses) => groupBy(expenses, 'event')
export const groupByCategory = (expenses) => groupBy(expenses, 'category')

export const computePartnerShare = (expenses) => {
  let me = 0
  let partner = 0
  for (const e of expenses) {
    const total = num(e.total_actual)
    if (e.share_type === 'shared_50') {
      me += total / 2
      partner += total / 2
    } else {
      me += total
    }
  }
  return { me, partner, total: me + partner }
}

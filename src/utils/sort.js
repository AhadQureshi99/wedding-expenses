/**
 * Sort comparator for the expenses table.
 * Each column knows whether it's numeric and what "asc" means for it
 * (e.g. for status, asc means pending → tbc → confirmed).
 */

const STATUS_RANK = { pending: 0, tbc: 1, confirmed: 2 }
const SHARE_RANK  = { shared_50: 0, non_shared: 1 }

// Per-column extractor + default direction for the FIRST click on that column.
export const COLUMN_DEFS = {
  event:        { get: (e) => e.event,             type: 'text',    initial: 'asc'  },
  category:     { get: (e) => e.category,          type: 'text',    initial: 'asc'  },
  supplier:     { get: (e) => e.supplier,          type: 'text',    initial: 'asc'  },
  total_actual: { get: (e) => e.total_actual,      type: 'number',  initial: 'desc' },
  share_type:   { get: (e) => SHARE_RANK[e.share_type] ?? 99,
                  type: 'number',  initial: 'asc'  },
  my_share:     { get: (e) => e.my_share,          type: 'number',  initial: 'desc' },
  paid_amount:  { get: (e) => e.paid_amount,       type: 'number',  initial: 'desc' },
  status:       { get: (e) => STATUS_RANK[e.status] ?? 99,
                  type: 'number',  initial: 'asc'  },
}

export const sortExpenses = (rows, key, dir) => {
  if (!key) return rows
  const def = COLUMN_DEFS[key]
  if (!def) return rows
  const mul = dir === 'desc' ? -1 : 1

  const copy = [...rows]
  copy.sort((a, b) => {
    const av = def.get(a)
    const bv = def.get(b)
    // Nulls always last regardless of direction
    if (av == null && bv == null) return 0
    if (av == null) return 1
    if (bv == null) return -1

    if (def.type === 'number') return (av - bv) * mul
    return String(av).localeCompare(String(bv)) * mul
  })
  return copy
}

/**
 * Click handler: clicking the active column flips direction;
 * clicking a new column resets to that column's `initial` direction.
 */
export const nextSort = (current, key) => {
  if (current.key !== key) return { key, dir: COLUMN_DEFS[key].initial }
  return { key, dir: current.dir === 'asc' ? 'desc' : 'asc' }
}

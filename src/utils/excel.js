/**
 * Excel import + export. The `@e965/xlsx` library is dynamically imported
 * so it lives in its own chunk and never weighs down the main bundle.
 */

const COLUMNS = [
  'Event',
  'Category',
  'Supplier',
  'Total (Actual)',
  'Share',
  'My Share',
  'Total Paid',
  'Fully Paid',
  'Status',
  'Notes',
]

const SHEET_NAME = 'Wedding Expenses'

const toNum = (v) => {
  if (v == null || v === '') return null
  if (typeof v === 'number') return Number.isFinite(v) ? v : null
  const n = Number(String(v).replace(/[, ]/g, ''))
  return Number.isFinite(n) ? n : null
}

const pickFirst = (row, keys) => {
  for (const k of keys) {
    if (row[k] != null && row[k] !== '') return row[k]
  }
  return null
}

// ───────────────────────────── EXPORT ────────────────────────────────

export const exportToExcel = async (expenses, filename = 'wedding-expenses.xlsx') => {
  const XLSX = await import('@e965/xlsx')

  const rows = expenses.map((e) => ({
    'Event':         e.event,
    'Category':      e.category,
    'Supplier':      e.supplier,
    'Total (Actual)': e.total_actual ?? '',
    'Share':         e.share_type === 'shared_50' ? 'Shared - 50%' : 'Non-Shared',
    'My Share':      e.my_share ?? '',
    'Total Paid':    e.paid_amount ?? 0,
    'Fully Paid':    e.is_fully_paid ? 'Yes' : 'No',
    'Status':        e.status,
    'Notes':         e.notes ?? '',
  }))

  const ws = XLSX.utils.json_to_sheet(rows, { header: COLUMNS })
  ws['!cols'] = [
    { wch: 18 }, { wch: 16 }, { wch: 40 }, { wch: 14 },
    { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 10 },
    { wch: 12 }, { wch: 30 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME)
  XLSX.writeFile(wb, filename)
}

// ───────────────────────────── IMPORT ────────────────────────────────

/**
 * Parse an .xlsx file into expense rows. Returns { rows, warnings }.
 * Tolerant to common column variations from the original spreadsheet.
 */
export const parseExcelFile = async (file) => {
  const XLSX = await import('@e965/xlsx')
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array' })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  if (!sheet) return { rows: [], warnings: ['No sheet found in the file.'] }

  const raw = XLSX.utils.sheet_to_json(sheet, { defval: null })

  const rows = []
  const warnings = []

  raw.forEach((r, i) => {
    const rowNo = i + 2 // accounting for header row in user-facing messages

    const event    = pickFirst(r, ['Event', 'event'])
    const category = pickFirst(r, ['Category', 'category'])
    const supplier = pickFirst(r, ['Supplier', 'Suppliers', 'supplier'])

    if (!event || !category || !supplier) {
      warnings.push(`Row ${rowNo}: skipped — missing Event, Category, or Supplier.`)
      return
    }

    const totalCell  = pickFirst(r, ['Total (Actual)', 'Total', 'total_actual'])
    const shareCell  = pickFirst(r, ['Share', 'share_type']) ?? 'Shared - 50%'
    const mineCell   = pickFirst(r, ['My Share', 'Prabhdeep', 'my_share'])
    const paidCell   = pickFirst(r, ['Total Paid', 'Paid', 'paid_amount'])
    const fullyCell  = pickFirst(r, ['Fully Paid', 'fully_paid'])
    const statusCell = pickFirst(r, ['Status', 'status'])
    const notesCell  = pickFirst(r, ['Notes', 'notes'])

    // ── Total
    const totalActual = toNum(totalCell)
    const totalString = totalCell == null ? '' : String(totalCell).trim().toLowerCase()

    // ── Share type
    const shareStr = String(shareCell).toLowerCase()
    const isShared50 =
      (shareStr.includes('shared') && !shareStr.includes('non')) ||
      shareStr === 'shared_50' ||
      shareStr.includes('50')

    // ── My share
    let myShare = toNum(mineCell)
    if (myShare == null && totalActual != null) {
      myShare = isShared50 ? totalActual / 2 : totalActual
    }

    // ── Paid
    let paidAmount = 0
    let isFullyPaid = false
    if (typeof paidCell === 'string' && paidCell.toLowerCase().includes('fully paid')) {
      isFullyPaid = true
      paidAmount = myShare ?? 0
    } else {
      paidAmount = toNum(paidCell) ?? 0
    }
    if (fullyCell != null) {
      const s = String(fullyCell).trim().toLowerCase()
      if (['yes', 'true', '1', 'y'].includes(s)) isFullyPaid = true
      if (['no', 'false', '0', 'n'].includes(s))  isFullyPaid = false
    }

    // ── Status
    let status = 'confirmed'
    if (totalActual == null) {
      status = totalString.includes('pending') ? 'pending' : 'tbc'
    }
    if (statusCell) {
      const s = String(statusCell).trim().toLowerCase()
      if (['confirmed', 'tbc', 'pending'].includes(s)) status = s
    }

    rows.push({
      event: String(event).trim(),
      category: String(category).trim(),
      supplier: String(supplier).trim(),
      total_actual: totalActual,
      share_type: isShared50 ? 'shared_50' : 'non_shared',
      my_share: myShare,
      paid_amount: paidAmount,
      is_fully_paid: isFullyPaid,
      status,
      notes: notesCell ? String(notesCell).trim() : null,
    })
  })

  return { rows, warnings }
}

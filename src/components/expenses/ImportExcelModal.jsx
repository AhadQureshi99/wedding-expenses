import { useRef, useState } from 'react'
import { Upload, FileSpreadsheet, AlertTriangle, Loader2 } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { parseExcelFile } from '@/utils/excel'
import { formatMoney, shareTypeLabel } from '@/utils/formatters'

const ImportExcelModal = ({ open, onClose, onImport }) => {
  const fileRef = useRef(null)
  const [file, setFile] = useState(null)
  const [parsing, setParsing] = useState(false)
  const [rows, setRows] = useState([])
  const [warnings, setWarnings] = useState([])
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('append') // 'append' | 'replace'
  const [importing, setImporting] = useState(false)

  const reset = () => {
    setFile(null); setRows([]); setWarnings([]); setError(null)
    setParsing(false); setImporting(false); setMode('append')
    if (fileRef.current) fileRef.current.value = ''
  }

  const close = () => { reset(); onClose() }

  const onFile = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setError(null)
    setParsing(true)
    try {
      const { rows, warnings } = await parseExcelFile(f)
      setRows(rows)
      setWarnings(warnings)
    } catch (err) {
      setError(err.message || 'Could not parse file.')
      setRows([])
    } finally {
      setParsing(false)
    }
  }

  const confirm = async () => {
    if (!rows.length) return
    setImporting(true)
    const result = await onImport(rows, mode)
    setImporting(false)
    if (result?.error) {
      setError(result.error.message)
      return
    }
    close()
  }

  return (
    <Modal open={open} onClose={close} title="Import from Excel" maxWidth="max-w-2xl">
      <div className="space-y-4">
        {/* File picker */}
        <label
          htmlFor="excel-file"
          className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 border-dashed border-slate-200 px-4 py-4 hover:border-rose-300 hover:bg-rose-50/30"
        >
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-6 w-6 text-rose-600" />
            <div>
              <div className="text-sm font-medium text-slate-900">
                {file ? file.name : 'Choose an .xlsx file'}
              </div>
              <div className="text-xs text-slate-500">
                Columns recognised: Event, Category, Supplier, Total (Actual), Share, My Share, Total Paid, Status, Notes.
              </div>
            </div>
          </div>
          <Upload className="h-4 w-4 text-slate-400" />
          <input
            id="excel-file"
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={onFile}
            className="hidden"
          />
        </label>

        {parsing && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" /> Parsing…
          </div>
        )}

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-inset ring-amber-200">
            <div className="mb-1 flex items-center gap-1.5 font-medium">
              <AlertTriangle className="h-4 w-4" /> {warnings.length} warning{warnings.length === 1 ? '' : 's'}
            </div>
            <ul className="list-disc pl-5">
              {warnings.slice(0, 4).map((w, i) => <li key={i}>{w}</li>)}
              {warnings.length > 4 && <li>…and {warnings.length - 4} more</li>}
            </ul>
          </div>
        )}

        {/* Preview */}
        {rows.length > 0 && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">
                {rows.length} row{rows.length === 1 ? '' : 's'} ready to import
              </span>
              <div className="flex gap-1 text-xs">
                <label className={`cursor-pointer rounded-md px-2 py-1 ring-1 ring-inset ${mode === 'append' ? 'bg-rose-50 text-rose-700 ring-rose-200' : 'text-slate-600 ring-slate-200'}`}>
                  <input type="radio" className="sr-only" checked={mode === 'append'} onChange={() => setMode('append')} />
                  Append
                </label>
                <label className={`cursor-pointer rounded-md px-2 py-1 ring-1 ring-inset ${mode === 'replace' ? 'bg-red-50 text-red-700 ring-red-200' : 'text-slate-600 ring-slate-200'}`}>
                  <input type="radio" className="sr-only" checked={mode === 'replace'} onChange={() => setMode('replace')} />
                  Replace all
                </label>
              </div>
            </div>

            <div className="max-h-64 overflow-auto rounded-lg ring-1 ring-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-3 py-2 text-left">Event</th>
                    <th className="px-3 py-2 text-left">Supplier</th>
                    <th className="px-3 py-2 text-right">Total</th>
                    <th className="px-3 py-2 text-left">Share</th>
                    <th className="px-3 py-2 text-right">My share</th>
                    <th className="px-3 py-2 text-right">Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.slice(0, 8).map((r, i) => (
                    <tr key={i}>
                      <td className="px-3 py-1.5">{r.event}</td>
                      <td className="px-3 py-1.5 truncate">{r.supplier}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">{formatMoney(r.total_actual)}</td>
                      <td className="px-3 py-1.5">{shareTypeLabel(r.share_type)}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">{formatMoney(r.my_share)}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">{formatMoney(r.paid_amount)}</td>
                    </tr>
                  ))}
                  {rows.length > 8 && (
                    <tr><td colSpan={6} className="px-3 py-1.5 text-center text-slate-400">…+{rows.length - 8} more</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {mode === 'replace' && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                ⚠️ <strong>Replace all</strong> will delete every existing expense first. This can't be undone.
              </p>
            )}
          </>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={close} className="btn-secondary">Cancel</button>
          <button
            onClick={confirm}
            disabled={importing || !rows.length}
            className={mode === 'replace' ? 'btn-danger' : 'btn-primary'}
          >
            {importing && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === 'replace' ? `Replace with ${rows.length}` : `Import ${rows.length}`}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ImportExcelModal

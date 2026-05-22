import { useEffect, useRef, useState } from 'react'
import { Loader2, Eye } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { useViewer } from '@/context/ViewerContext'
import { ADMIN_NAME } from '@/constants'

const PinModal = ({ open, onClose }) => {
  const { enter } = useViewer()
  const [pin, setPin] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setPin('')
      setErr(null)
      setBusy(false)
      // Tiny delay so the autofocus wins after the modal mounts.
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const submit = async (e) => {
    e.preventDefault()
    setErr(null)
    setBusy(true)
    const { error } = await enter(pin)
    setBusy(false)
    if (error) {
      setErr(error.message?.includes('invalid pin') ? 'Wrong PIN.' : error.message)
      setPin('')
      inputRef.current?.focus()
      return
    }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={`View ${ADMIN_NAME}'s expenses`} maxWidth="max-w-sm">
      <form onSubmit={submit} className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-900">
          <Eye className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Enter the 4-digit PIN {ADMIN_NAME} shared with you. You'll get a read-only view of
            their wedding expenses.
          </p>
        </div>

        <div>
          <label className="label">4-digit PIN</label>
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            required
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            className="input text-center text-lg tracking-[0.5em]"
            placeholder="••••"
          />
        </div>

        {err && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={busy || pin.length < 4} className="btn-primary">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            View
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default PinModal

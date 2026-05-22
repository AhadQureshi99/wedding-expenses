import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import PinModal from './PinModal'
import { useViewer } from '@/context/ViewerContext'
import { ADMIN_NAME } from '@/constants'

const ViewerSwitch = () => {
  const { viewerMode, exit } = useViewer()
  const [open, setOpen] = useState(false)

  if (viewerMode) {
    return (
      <button
        onClick={exit}
        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-200"
      >
        <EyeOff className="h-4 w-4" />
        Exit viewer
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
        title={`View ${ADMIN_NAME}'s expenses (read-only)`}
      >
        <Eye className="h-4 w-4" />
        View {ADMIN_NAME}'s
      </button>
      <PinModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export default ViewerSwitch

import { Eye, EyeOff } from 'lucide-react'
import { useViewer } from '@/context/ViewerContext'
import { ADMIN_NAME } from '@/constants'

const ViewerSwitch = () => {
  const { viewerMode, exit, openPinModal } = useViewer()

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
    <button
      onClick={openPinModal}
      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
      title={`View ${ADMIN_NAME}'s expenses (read-only)`}
    >
      <Eye className="h-4 w-4" />
      View {ADMIN_NAME}'s
    </button>
  )
}

export default ViewerSwitch

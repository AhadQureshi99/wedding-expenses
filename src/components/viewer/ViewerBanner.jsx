import { Eye } from 'lucide-react'
import { useViewer } from '@/context/ViewerContext'
import { ADMIN_NAME } from '@/constants'

const ViewerBanner = () => {
  const { viewerMode, exit } = useViewer()
  if (!viewerMode) return null

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-amber-50 px-4 py-2 text-sm text-amber-900 ring-1 ring-inset ring-amber-200">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4" />
        Viewing <span className="font-semibold">{ADMIN_NAME}'s</span> expenses — read-only.
      </div>
      <button onClick={exit} className="font-medium underline-offset-2 hover:underline">
        Exit viewer
      </button>
    </div>
  )
}

export default ViewerBanner

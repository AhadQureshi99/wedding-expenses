import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import ViewerBanner from '@/components/viewer/ViewerBanner'
import PinModal from '@/components/viewer/PinModal'
import { useViewer } from '@/context/ViewerContext'

const AppShell = () => {
  const { pinModalOpen, closePinModal } = useViewer()
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <ViewerBanner />
        <Outlet />
      </main>
      <PinModal open={pinModalOpen} onClose={closePinModal} />
    </div>
  )
}

export default AppShell

import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import ViewerBanner from '@/components/viewer/ViewerBanner'

const AppShell = () => (
  <div className="min-h-screen">
    <Navbar />
    <main className="mx-auto max-w-6xl px-4 py-6">
      <ViewerBanner />
      <Outlet />
    </main>
  </div>
)

export default AppShell

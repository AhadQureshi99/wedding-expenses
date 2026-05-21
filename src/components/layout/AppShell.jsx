import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const AppShell = () => (
  <div className="min-h-screen">
    <Navbar />
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Outlet />
    </main>
  </div>
)

export default AppShell

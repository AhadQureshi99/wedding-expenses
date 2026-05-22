import { NavLink } from 'react-router-dom'
import { Heart, LayoutDashboard, Receipt, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import ViewerSwitch from '@/components/viewer/ViewerSwitch'

const navItems = [
  { to: '/',         label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses',  icon: Receipt },
]

const Navbar = () => {
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-rose-600" fill="currentColor" />
          <span className="text-lg font-display">Wedding Expenses</span>
        </div>

        <nav className="hidden gap-1 sm:flex">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  isActive ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ViewerSwitch />
          <span className="hidden text-xs text-slate-500 sm:inline">{user?.email}</span>
          <button onClick={signOut} className="btn-ghost px-2 py-1.5" title="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      <nav className="flex gap-1 border-t border-slate-200 px-4 py-2 sm:hidden">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Navbar

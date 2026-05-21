import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Spinner from '@/components/ui/Spinner'
import Login from '@/pages/Login'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Expenses  = lazy(() => import('@/pages/Expenses'))

const PageFallback = () => (
  <div className="grid place-items-center py-24"><Spinner /></div>
)

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />

    <Route
      element={
        <ProtectedRoute>
          <AppShell />
        </ProtectedRoute>
      }
    >
      <Route
        path="/"
        element={
          <Suspense fallback={<PageFallback />}>
            <Dashboard />
          </Suspense>
        }
      />
      <Route
        path="/expenses"
        element={
          <Suspense fallback={<PageFallback />}>
            <Expenses />
          </Suspense>
        }
      />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default App

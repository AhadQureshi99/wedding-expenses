import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Heart, Loader2, Eye } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useViewer } from '@/context/ViewerContext'
import { ADMIN_NAME } from '@/constants'

const Login = () => {
  const { session, signIn, signUp, signInAnon } = useAuth()
  const { openPinModal } = useViewer()
  const location = useLocation()
  const [mode, setMode] = useState('sign_in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)
  const [busy, setBusy] = useState(false)
  const [guestBusy, setGuestBusy] = useState(false)

  if (session) {
    const to = location.state?.from?.pathname ?? '/'
    return <Navigate to={to} replace />
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setBusy(true)
    const fn = mode === 'sign_in' ? signIn : signUp
    const { error: err } = await fn(email, password)
    setBusy(false)
    if (err) {
      setError(err.message)
      return
    }
    if (mode === 'sign_up') {
      setInfo('Account created. Check your inbox to confirm — or log in if confirmation is disabled.')
    }
  }

  const onGuest = async () => {
    setError(null)
    setInfo(null)
    setGuestBusy(true)
    const { error: err } = await signInAnon()
    setGuestBusy(false)
    if (err) {
      // Most common cause: "Anonymous sign-ins are disabled" — surface clearly.
      setError(err.message || 'Could not start guest session.')
      return
    }
    // Pre-open the PIN modal so it's ready when AppShell mounts after redirect.
    openPinModal()
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-rose-50 via-white to-amber-50 p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Heart className="h-6 w-6 text-rose-600" fill="currentColor" />
          <h1 className="text-2xl font-display">Wedding Expenses</h1>
        </div>

        <form onSubmit={onSubmit} className="card space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'sign_in' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {info  && <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{info}</p>}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === 'sign_in' ? 'Sign in' : 'Create account'}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === 'sign_in' ? 'sign_up' : 'sign_in')}
            className="block w-full text-center text-sm text-slate-500 hover:text-slate-700"
          >
            {mode === 'sign_in' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-wider text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          <span>or</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={onGuest}
          disabled={guestBusy}
          className="btn-secondary w-full"
        >
          {guestBusy
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Eye className="h-4 w-4" />}
          Continue as guest
        </button>
        <p className="mt-2 text-center text-xs text-slate-500">
          You'll be asked for {ADMIN_NAME}'s 4-digit PIN. View-only access.
        </p>
      </div>
    </div>
  )
}

export default Login

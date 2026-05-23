import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ADMIN_EMAIL } from '@/constants'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const user = session?.user ?? null
  const isAdmin =
    !!user?.email &&
    user.email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase()

  const value = {
    session,
    user,
    isAdmin,
    loading,
    signIn:    (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signUp:    (email, password) => supabase.auth.signUp({ email, password }),
    signOut:   () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

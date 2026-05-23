import { createContext, useCallback, useContext, useState } from 'react'
import { supabase } from '@/lib/supabase'

const ViewerContext = createContext(null)

export const ViewerProvider = ({ children }) => {
  // PIN is kept in memory only — closing the tab clears viewer mode.
  const [pin, setPin] = useState(null)
  // PIN modal is rendered globally in <AppShell>; anyone can open it.
  const [pinModalOpen, setPinModalOpen] = useState(false)

  const enter = useCallback(async (candidatePin) => {
    const { data, error } = await supabase.rpc('view_admin_expenses', { p_pin: candidatePin })
    if (error) return { error }
    setPin(candidatePin)
    return { data }
  }, [])

  const exit = useCallback(() => setPin(null), [])

  const openPinModal  = useCallback(() => setPinModalOpen(true),  [])
  const closePinModal = useCallback(() => setPinModalOpen(false), [])

  const value = {
    viewerMode: pin !== null,
    pin,
    enter,
    exit,
    pinModalOpen,
    openPinModal,
    closePinModal,
  }

  return <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>
}

export const useViewer = () => {
  const ctx = useContext(ViewerContext)
  if (!ctx) throw new Error('useViewer must be used inside <ViewerProvider>')
  return ctx
}

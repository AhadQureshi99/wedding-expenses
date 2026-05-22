import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useViewer } from '@/context/ViewerContext'

const READ_ONLY = { error: { message: 'Viewer mode is read-only.' } }

export const useExpenses = () => {
  const { user } = useAuth()
  const { viewerMode, pin } = useViewer()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const { data, error: err } = viewerMode
      ? await supabase.rpc('view_admin_expenses', { p_pin: pin })
      : await supabase
          .from('expenses')
          .select('*')
          .order('event', { ascending: true })
          .order('created_at', { ascending: true })

    if (err) setError(err.message)
    else {
      setExpenses(data ?? [])
      setError(null)
    }
    setLoading(false)
  }, [user, viewerMode, pin])

  useEffect(() => { fetchAll() }, [fetchAll])

  const create = async (payload) => {
    if (viewerMode) return READ_ONLY
    const row = { ...payload, user_id: user.id }
    const { data, error: err } = await supabase.from('expenses').insert(row).select().single()
    if (err) return { error: err }
    setExpenses((prev) => [...prev, data])
    return { data }
  }

  const update = async (id, patch) => {
    if (viewerMode) return READ_ONLY
    const { data, error: err } = await supabase
      .from('expenses')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (err) return { error: err }
    setExpenses((prev) => prev.map((e) => (e.id === id ? data : e)))
    return { data }
  }

  const remove = async (id) => {
    if (viewerMode) return READ_ONLY
    const { error: err } = await supabase.from('expenses').delete().eq('id', id)
    if (err) return { error: err }
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    return {}
  }

  const bulkInsert = async (rows) => {
    if (viewerMode) return READ_ONLY
    if (!user || !rows?.length) return { data: [] }
    const payload = rows.map((r) => ({ ...r, user_id: user.id }))
    const { data, error: err } = await supabase.from('expenses').insert(payload).select()
    if (err) return { error: err }
    setExpenses((prev) => [...prev, ...(data ?? [])])
    return { data }
  }

  /**
   * Replace ALL of the user's expenses with `rows`. Safer than delete-then-insert:
   * inserts the new batch first, then deletes the previous IDs only on success.
   */
  const replaceAll = async (rows) => {
    if (viewerMode) return READ_ONLY
    if (!user) return { error: { message: 'Not signed in.' } }

    const oldIds = expenses.map((e) => e.id)
    const payload = rows.map((r) => ({ ...r, user_id: user.id }))

    const { data: inserted, error: insertErr } = await supabase
      .from('expenses')
      .insert(payload)
      .select()
    if (insertErr) return { error: insertErr }

    if (oldIds.length) {
      const { error: delErr } = await supabase.from('expenses').delete().in('id', oldIds)
      if (delErr) return { error: delErr, partial: true }
    }

    setExpenses(inserted ?? [])
    return { data: inserted }
  }

  return {
    expenses,
    loading,
    error,
    readOnly: viewerMode,
    create,
    update,
    remove,
    bulkInsert,
    replaceAll,
    refetch: fetchAll,
  }
}

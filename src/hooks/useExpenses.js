import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export const useExpenses = () => {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error: err } = await supabase
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
  }, [user])

  useEffect(() => { fetchAll() }, [fetchAll])

  const create = async (payload) => {
    const row = { ...payload, user_id: user.id }
    const { data, error: err } = await supabase
      .from('expenses')
      .insert(row)
      .select()
      .single()
    if (err) return { error: err }
    setExpenses((prev) => [...prev, data])
    return { data }
  }

  const update = async (id, patch) => {
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
    const { error: err } = await supabase.from('expenses').delete().eq('id', id)
    if (err) return { error: err }
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    return {}
  }

  return { expenses, loading, error, create, update, remove, refetch: fetchAll }
}

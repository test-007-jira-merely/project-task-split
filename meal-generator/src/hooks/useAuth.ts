import { useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useAppStore } from '../stores/useAppStore'

export const useAuth = () => {
  const { user, setUser } = useAppStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  return { user }
}

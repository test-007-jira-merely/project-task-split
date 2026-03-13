import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../services/supabase'
import { useAppStore } from '../stores/useAppStore'

export const useHistory = () => {
  const { user, setHistoryMealIds } = useAppStore()

  const { data: history, isLoading } = useQuery({
    queryKey: ['history', user?.id],
    queryFn: async () => {
      if (!user) return []

      const { data, error } = await supabase
        .from('user_history')
        .select('meal_id, generated_at')
        .eq('user_id', user.id)
        .order('generated_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data || []
    },
    enabled: !!user,
  })

  useEffect(() => {
    if (history) {
      setHistoryMealIds(history.map((h: any) => h.meal_id))
    }
  }, [history, setHistoryMealIds])

  return { history, isLoading }
}

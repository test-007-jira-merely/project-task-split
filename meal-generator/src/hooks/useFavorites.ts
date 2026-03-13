import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../services/supabase'
import { useAppStore } from '../stores/useAppStore'

export const useFavorites = () => {
  const { user, setFavoriteIds } = useAppStore()

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return []

      const { data, error } = await supabase
        .from('favorites')
        .select('meal_id')
        .eq('user_id', user.id)

      if (error) throw error
      return data || []
    },
    enabled: !!user,
  })

  useEffect(() => {
    if (favorites) {
      setFavoriteIds(favorites.map((f: any) => f.meal_id))
    }
  }, [favorites, setFavoriteIds])

  return { favorites, isLoading }
}

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/stores/useAppStore';
import { supabaseHelpers } from '@/services/supabase';

export function useFavorites() {
  const { user, favorites, setFavorites, addFavorite, removeFavorite } = useAppStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabaseHelpers.getFavorites(user.id);
      return data || [];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (data) {
      setFavorites(data as any);
    }
  }, [data, setFavorites]);

  const addMutation = useMutation({
    mutationFn: async (mealId: string) => {
      if (!user) throw new Error('Not authenticated');
      const { data } = await supabaseHelpers.addFavorite(user.id, mealId);
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        addFavorite(data);
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
      }
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (favoriteId: string) => {
      await supabaseHelpers.removeFavorite(favoriteId);
      return favoriteId;
    },
    onSuccess: (favoriteId) => {
      removeFavorite(favoriteId);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const isFavorite = (mealId: string) =>
    favorites.some(f => f.meal_id === mealId);

  const getFavoriteId = (mealId: string) =>
    favorites.find(f => f.meal_id === mealId)?.id;

  return {
    favorites,
    isLoading,
    addToFavorites: addMutation.mutate,
    removeFromFavorites: removeMutation.mutate,
    isFavorite,
    getFavoriteId,
  };
}

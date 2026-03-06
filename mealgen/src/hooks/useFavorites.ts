import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { favoritesService } from '@/services/favoritesService';
import { useAppStore } from '@/stores/useAppStore';

export function useFavorites() {
  const queryClient = useQueryClient();
  const user = useAppStore((state) => state.user);
  const setFavorites = useAppStore((state) => state.setFavorites);

  const query = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => {
      if (!user) return [];
      return favoritesService.getFavorites(user.id);
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (query.data) {
      setFavorites(query.data);
    }
  }, [query.data, setFavorites]);

  const addMutation = useMutation({
    mutationFn: (mealId: string) => {
      if (!user) throw new Error('User not authenticated');
      return favoritesService.addFavorite(user.id, mealId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (mealId: string) => {
      if (!user) throw new Error('User not authenticated');
      return favoritesService.removeFavorite(user.id, mealId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  return {
    favorites: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    addFavorite: addMutation.mutate,
    removeFavorite: removeMutation.mutate,
    isAddingFavorite: addMutation.isPending,
    isRemovingFavorite: removeMutation.isPending,
  };
}

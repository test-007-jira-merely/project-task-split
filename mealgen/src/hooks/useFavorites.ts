import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesService } from '@/services/favoritesService';
import { useAppStore } from '@/stores/useAppStore';
import { useEffect } from 'react';

export function useFavorites() {
  const queryClient = useQueryClient();
  const user = useAppStore(state => state.user);
  const setFavorites = useAppStore(state => state.setFavorites);

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => favoritesService.getFavorites(user!.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (favorites) {
      setFavorites(favorites);
    }
  }, [favorites, setFavorites]);

  const addMutation = useMutation({
    mutationFn: (mealId: string) => favoritesService.addFavorite(user!.id, mealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (mealId: string) => favoritesService.removeFavorite(user!.id, mealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  return {
    favorites,
    addFavorite: addMutation.mutate,
    removeFavorite: removeMutation.mutate,
    isLoading: addMutation.isPending || removeMutation.isPending,
  };
}

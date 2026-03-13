import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesService } from '../services/supabase';
import { useAppStore } from '../stores/useAppStore';

export function useFavorites() {
  const user = useAppStore(state => state.user);

  return useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => favoritesService.getFavorites(user!.id),
    enabled: !!user,
    staleTime: 30 * 1000
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  const user = useAppStore(state => state.user);
  const addFavorite = useAppStore(state => state.addFavorite);

  return useMutation({
    mutationFn: (mealId: string) => favoritesService.addFavorite(user!.id, mealId),
    onSuccess: (_, mealId) => {
      addFavorite(mealId);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    }
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  const user = useAppStore(state => state.user);
  const removeFavorite = useAppStore(state => state.removeFavorite);

  return useMutation({
    mutationFn: (mealId: string) => favoritesService.removeFavorite(user!.id, mealId),
    onSuccess: (_, mealId) => {
      removeFavorite(mealId);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    }
  });
}

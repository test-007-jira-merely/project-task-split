import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAppStore } from '@/stores/useAppStore';

export function useFavorites(userId?: string) {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => apiClient.getFavorites(userId),
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  const addFavoriteId = useAppStore((state) => state.addFavoriteId);

  return useMutation({
    mutationFn: ({ dishId, userId }: { dishId: string; userId?: string }) =>
      apiClient.addFavorite(dishId, userId),
    onSuccess: (_, variables) => {
      addFavoriteId(variables.dishId);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  const removeFavoriteId = useAppStore((state) => state.removeFavoriteId);

  return useMutation({
    mutationFn: ({ dishId, userId }: { dishId: string; userId?: string }) =>
      apiClient.removeFavorite(dishId, userId),
    onSuccess: (_, variables) => {
      removeFavoriteId(variables.dishId);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useIsFavorite(dishId: string, userId?: string) {
  const favoriteIds = useAppStore((state) => state.favoriteIds);

  return useQuery({
    queryKey: ['favorite-check', dishId, userId],
    queryFn: () => apiClient.isFavorite(dishId, userId),
    initialData: { isFavorite: favoriteIds.includes(dishId) },
  });
}

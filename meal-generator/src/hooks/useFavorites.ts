import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesService } from '@/services/favoritesService';
import { QUERY_KEYS } from '@/utils/constants';
import useAppStore from '@/stores/useAppStore';

export function useFavorites() {
  const { user } = useAppStore();

  return useQuery({
    queryKey: [QUERY_KEYS.favorites, user?.id],
    queryFn: () => user ? favoritesService.getFavorites(user.id) : [],
    enabled: !!user,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  const { user, addFavorite: addFavoriteStore } = useAppStore();

  return useMutation({
    mutationFn: (mealId: string) => {
      if (!user) throw new Error('User not authenticated');
      return favoritesService.addFavorite(user.id, mealId);
    },
    onSuccess: (favorite) => {
      addFavoriteStore(favorite);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.favorites] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  const { removeFavorite: removeFavoriteStore } = useAppStore();

  return useMutation({
    mutationFn: (favoriteId: string) => favoritesService.removeFavorite(favoriteId),
    onSuccess: (_, favoriteId) => {
      removeFavoriteStore(favoriteId);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.favorites] });
    },
  });
}

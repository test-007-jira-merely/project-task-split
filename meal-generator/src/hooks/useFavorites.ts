import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesService } from '@/services/favoritesService';
import { useAppStore } from '@/stores/useAppStore';

export function useFavorites() {
  const user = useAppStore((state) => state.user);

  return useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => favoritesService.getUserFavorites(user!.id),
    enabled: !!user,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const user = useAppStore((state) => state.user);

  return useMutation({
    mutationFn: async ({ mealId, isFavorite }: { mealId: string; isFavorite: boolean }) => {
      if (!user) throw new Error('User not authenticated');

      if (isFavorite) {
        await favoritesService.removeFavorite(user.id, mealId);
      } else {
        await favoritesService.addFavorite(user.id, mealId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

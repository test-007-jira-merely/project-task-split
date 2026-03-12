import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesService } from '@/services/favoritesService';
import { useAppStore } from '@/stores/useAppStore';

export const useFavorites = () => {
  const { user, favorites, setFavorites, addFavorite, removeFavorite } = useAppStore();

  const { isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const favorites = await favoritesService.getUserFavorites(user.id);
      const mealIds = favorites.map(f => f.meal_id);
      setFavorites(mealIds);
      return favorites;
    },
    enabled: !!user,
  });

  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (mealId: string) => {
      if (!user) throw new Error('Not authenticated');
      return favoritesService.addFavorite(user.id, mealId);
    },
    onSuccess: (_, mealId) => {
      addFavorite(mealId);
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (mealId: string) => {
      if (!user) throw new Error('Not authenticated');
      return favoritesService.removeFavorite(user.id, mealId);
    },
    onSuccess: (_, mealId) => {
      removeFavorite(mealId);
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  return {
    favorites,
    isLoading,
    addFavorite: addMutation.mutate,
    removeFavorite: removeMutation.mutate,
    isFavorite: (mealId: string) => favorites.includes(mealId),
  };
};

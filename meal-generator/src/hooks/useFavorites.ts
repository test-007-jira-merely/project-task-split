import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesService } from '../services/favoritesService';
import { useAppStore } from '../stores/useAppStore';

export const useFavorites = () => {
  const user = useAppStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => favoritesService.getUserFavorites(user!.id),
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: ({ mealId }: { mealId: string }) =>
      favoritesService.addFavorite(user!.id, mealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ mealId }: { mealId: string }) =>
      favoritesService.removeFavorite(user!.id, mealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  return {
    favorites,
    isLoading,
    addFavorite: addMutation.mutate,
    removeFavorite: removeMutation.mutate,
  };
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mealService } from '@services/mealService';
import { useAppStore } from '@stores/useAppStore';

export function useFavorites() {
  const queryClient = useQueryClient();
  const { user, setFavorites, addToFavorites, removeFromFavorites } = useAppStore();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => mealService.getFavorites(user!.id),
    enabled: !!user,
    onSuccess: (data) => {
      setFavorites(data);
    },
  });

  const addFavoriteMutation = useMutation({
    mutationFn: (mealId: string) => mealService.addFavorite(user!.id, mealId),
    onMutate: async (mealId) => {
      await queryClient.cancelQueries({ queryKey: ['favorites', user?.id] });
      const previousFavorites = queryClient.getQueryData(['favorites', user?.id]);

      const meal = queryClient.getQueryData<any>(['meals'])?.find((m: any) => m.id === mealId);
      if (meal) {
        addToFavorites(meal);
      }

      return { previousFavorites };
    },
    onError: (err, mealId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites', user?.id], context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (mealId: string) => mealService.removeFavorite(user!.id, mealId),
    onMutate: async (mealId) => {
      await queryClient.cancelQueries({ queryKey: ['favorites', user?.id] });
      const previousFavorites = queryClient.getQueryData(['favorites', user?.id]);

      removeFromFavorites(mealId);

      return { previousFavorites };
    },
    onError: (err, mealId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites', user?.id], context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const isFavorite = (mealId: string) => {
    return favorites.some((m) => m.id === mealId);
  };

  return {
    favorites,
    isLoading,
    addFavorite: addFavoriteMutation.mutateAsync,
    removeFavorite: removeFavoriteMutation.mutateAsync,
    isFavorite,
  };
}

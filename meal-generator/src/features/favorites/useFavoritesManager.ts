import { useQuery } from '@tanstack/react-query';
import { mealService } from '@services/mealService';
import { useAuth } from '@hooks/useAuth';

export function useFavoritesManager() {
  const { user } = useAuth();

  const { data: favorites = [], isLoading, error } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => mealService.getFavorites(user!.id),
    enabled: !!user,
  });

  return {
    favorites,
    isLoading,
    error,
  };
}

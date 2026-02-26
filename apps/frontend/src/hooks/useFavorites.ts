import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useUserActivityStore } from '../stores/useUserActivityStore';

const USER_ID = 'demo-user'; // TODO: Replace with actual auth user ID

export function useFavorites() {
  const { setFavorites, addFavorite, removeFavorite } = useUserActivityStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['favorites', USER_ID],
    queryFn: () => apiClient.getUserFavorites(USER_ID),
    onSuccess: (data) => setFavorites(data),
  });

  const addMutation = useMutation({
    mutationFn: (dishId: string) =>
      apiClient.addFavorite({ userId: USER_ID, dishId }),
    onSuccess: (data) => {
      addFavorite(data);
      queryClient.invalidateQueries({ queryKey: ['favorites', USER_ID] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (dishId: string) => apiClient.removeFavorite(USER_ID, dishId),
    onSuccess: (_, dishId) => {
      removeFavorite(dishId);
      queryClient.invalidateQueries({ queryKey: ['favorites', USER_ID] });
    },
  });

  return {
    favorites: query.data || [],
    isLoading: query.isLoading,
    addFavorite: addMutation.mutate,
    removeFavorite: removeMutation.mutate,
  };
}

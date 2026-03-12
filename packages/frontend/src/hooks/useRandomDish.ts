import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useDishStore } from '@/stores/dish-store';
import { RandomDishRequest } from '@meal-platform/shared';

export function useRandomDish() {
  const { addToHistory, dishHistory } = useDishStore();

  return useMutation({
    mutationFn: async (params?: RandomDishRequest) => {
      const excludeIds = dishHistory.slice(-5).map(d => d.id);
      return apiClient.getRandomDish({ ...params, excludeIds });
    },
    onSuccess: (response) => {
      addToHistory(response.data);
    },
  });
}

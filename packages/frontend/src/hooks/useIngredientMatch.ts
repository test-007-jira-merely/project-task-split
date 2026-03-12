import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useIngredientStore } from '@/stores/ingredient-store';
import { IngredientMatchRequest } from '@meal-platform/shared';

export function useIngredientMatch() {
  const { setMatchResults } = useIngredientStore();

  return useMutation({
    mutationFn: async (request: IngredientMatchRequest) => {
      return apiClient.matchIngredients(request);
    },
    onSuccess: (response) => {
      setMatchResults(response.data.matches);
    },
  });
}

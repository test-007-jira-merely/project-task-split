import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAppStore } from '@/stores/useAppStore';

export function useIngredientMatching() {
  const setMatchResults = useAppStore((state) => state.setMatchResults);

  return useMutation({
    mutationFn: ({
      ingredients,
      allowSubstitutes = true,
      maxResults = 10,
    }: {
      ingredients: string[];
      allowSubstitutes?: boolean;
      maxResults?: number;
    }) => apiClient.findMatches(ingredients, allowSubstitutes, maxResults),
    onSuccess: (results) => {
      setMatchResults(results);
    },
  });
}

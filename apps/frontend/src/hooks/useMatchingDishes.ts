import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useMatchingStore } from '../stores/useMatchingStore';

export function useMatchingDishes() {
  const { setMatches, setMatching, setError } = useMatchingStore();

  return useMutation({
    mutationFn: (userIngredients: string[]) =>
      apiClient.findMatchingDishes({
        userIngredients,
        includeSubstitutions: true,
        minMatchScore: 30,
      }),
    onMutate: () => {
      setMatching(true);
      setError(null);
    },
    onSuccess: (response) => {
      setMatches(response.matches);
      setMatching(false);
    },
    onError: (error: Error) => {
      setError(error.message);
      setMatching(false);
    },
  });
}

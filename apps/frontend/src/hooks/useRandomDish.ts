import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useDishStore } from '../stores/useDishStore';

export function useRandomDish() {
  const { addToHistory, setCurrentDish, setLoading, setError } = useDishStore();

  return useMutation({
    mutationFn: (excludeIds?: string[]) => apiClient.getRandomDish(excludeIds),
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (dish) => {
      setCurrentDish(dish);
      addToHistory(dish);
      setLoading(false);
    },
    onError: (error: Error) => {
      setError(error.message);
      setLoading(false);
    },
  });
}

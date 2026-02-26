import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAppStore } from '@/stores/useAppStore';

export function useRandomDish() {
  const setCurrentDish = useAppStore((state) => state.setCurrentDish);
  const addHistoryId = useAppStore((state) => state.addHistoryId);

  return useMutation({
    mutationFn: () => apiClient.getRandomDish(),
    onSuccess: (dish) => {
      setCurrentDish(dish);
      addHistoryId(dish.id);
      // Optimistically add to backend history
      apiClient.addToHistory(dish.id).catch(console.error);
    },
  });
}

export function useAllDishes() {
  return useQuery({
    queryKey: ['dishes'],
    queryFn: () => apiClient.getAllDishes(),
  });
}

export function useDishById(id: string) {
  return useQuery({
    queryKey: ['dish', id],
    queryFn: () => apiClient.getDishById(id),
    enabled: !!id,
  });
}

export function useSearchDishes(query: string) {
  return useQuery({
    queryKey: ['dishes', 'search', query],
    queryFn: () => apiClient.searchDishes(query),
    enabled: query.length > 0,
  });
}

export function useDishesByCategory(category: string) {
  return useQuery({
    queryKey: ['dishes', 'category', category],
    queryFn: () => apiClient.getDishesByCategory(category),
    enabled: !!category,
  });
}

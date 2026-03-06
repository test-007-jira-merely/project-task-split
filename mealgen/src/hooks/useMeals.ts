import { useQuery } from '@tanstack/react-query';
import { mealService } from '@/services/mealService';
import type { Meal } from '@/types';

export function useMeals() {
  return useQuery<Meal[], Error>({
    queryKey: ['meals'],
    queryFn: mealService.getLocalMeals,
    staleTime: Infinity, // Local data never becomes stale
    gcTime: Infinity, // Cache data indefinitely (previously cacheTime)
  });
}

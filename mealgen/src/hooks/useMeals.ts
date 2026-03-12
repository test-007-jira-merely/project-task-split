import { useQuery } from '@tanstack/react-query';
import { mealService } from '@/services/mealService';

export function useMeals() {
  return useQuery({
    queryKey: ['meals'],
    queryFn: () => {
      const localMeals = mealService.getLocalMeals();
      return localMeals;
    },
  });
}

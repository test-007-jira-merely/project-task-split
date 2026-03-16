import { useQuery } from '@tanstack/react-query';
import { mealService } from '../services/mealService';

export const useMeals = () => {
  return useQuery({
    queryKey: ['meals'],
    queryFn: mealService.getAllMeals,
  });
};

export const useMeal = (id: string) => {
  return useQuery({
    queryKey: ['meal', id],
    queryFn: () => mealService.getMealById(id),
    enabled: !!id,
  });
};

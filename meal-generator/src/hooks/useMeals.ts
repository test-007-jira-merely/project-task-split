import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mealService } from '@services/mealService';
import type { Meal } from '@types/meal';

export function useMeals() {
  const queryClient = useQueryClient();

  const { data: meals = [], isLoading, error } = useQuery({
    queryKey: ['meals'],
    queryFn: () => mealService.getAllMeals(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createMealMutation = useMutation({
    mutationFn: (meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>) =>
      mealService.createMeal(meal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  const updateMealMutation = useMutation({
    mutationFn: ({ id, meal }: { id: string; meal: Partial<Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>> }) =>
      mealService.updateMeal(id, meal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  const deleteMealMutation = useMutation({
    mutationFn: (id: string) => mealService.deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  return {
    meals,
    isLoading,
    error,
    createMeal: createMealMutation.mutateAsync,
    updateMeal: updateMealMutation.mutateAsync,
    deleteMeal: deleteMealMutation.mutateAsync,
  };
}

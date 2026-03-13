import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mealService } from '@/services/mealService';
import { Meal } from '@/types';

export function useMeals() {
  return useQuery({
    queryKey: ['meals'],
    queryFn: () => mealService.getAllMeals(),
  });
}

export function useMeal(id: string) {
  return useQuery({
    queryKey: ['meal', id],
    queryFn: () => mealService.getMealById(id),
    enabled: !!id,
  });
}

export function useCreateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meal: Omit<Meal, 'id' | 'created_at'>) => mealService.createMeal(meal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
}

export function useUpdateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, meal }: { id: string; meal: Partial<Omit<Meal, 'id' | 'created_at'>> }) =>
      mealService.updateMeal(id, meal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
}

export function useDeleteMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mealService.deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
}

export function useImportMeals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meals: Omit<Meal, 'id' | 'created_at'>[]) => mealService.importMeals(meals),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
}

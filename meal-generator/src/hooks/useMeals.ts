import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mealService } from '../services/mealService';
import type { Meal } from '../types';

export function useMeals() {
  return useQuery({
    queryKey: ['meals'],
    queryFn: () => mealService.getAllMeals(),
    staleTime: 5 * 60 * 1000
  });
}

export function useMeal(id: string) {
  return useQuery({
    queryKey: ['meal', id],
    queryFn: () => mealService.getMealById(id),
    enabled: !!id
  });
}

export function useCreateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>) =>
      mealService.createMeal(meal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    }
  });
}

export function useUpdateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Meal> }) =>
      mealService.updateMeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    }
  });
}

export function useDeleteMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mealService.deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    }
  });
}

export function useBulkImportMeals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meals: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>[]) =>
      mealService.bulkImportMeals(meals),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    }
  });
}

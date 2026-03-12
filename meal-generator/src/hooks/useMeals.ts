import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mealService } from '@/services/mealService';
import { QUERY_KEYS } from '@/utils/constants';
import { Meal, MealFilter } from '@/types';

export function useMeals() {
  return useQuery({
    queryKey: [QUERY_KEYS.meals],
    queryFn: () => mealService.getAllMeals(),
  });
}

export function useMeal(id: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.meal, id],
    queryFn: () => id ? mealService.getMealById(id) : null,
    enabled: !!id,
  });
}

export function useFilteredMeals(filter: MealFilter) {
  return useQuery({
    queryKey: [QUERY_KEYS.meals, 'filtered', filter],
    queryFn: () => mealService.filterMeals(filter),
    enabled: Object.keys(filter).length > 0,
  });
}

export function useCreateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>) =>
      mealService.createMeal(meal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.meals] });
    },
  });
}

export function useUpdateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, meal }: { id: string; meal: Partial<Meal> }) =>
      mealService.updateMeal(id, meal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.meals] });
    },
  });
}

export function useDeleteMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mealService.deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.meals] });
    },
  });
}

export function useImportMeals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meals: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>[]) =>
      mealService.importMeals(meals),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.meals] });
    },
  });
}

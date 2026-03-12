import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mealService } from '@/services/mealService';
import { Meal } from '@/types';
import mealsData from '@/data/meals.json';

export const useMeals = () => {
  return useQuery({
    queryKey: ['meals'],
    queryFn: async () => {
      try {
        const supabaseMeals = await mealService.getAllMeals();
        if (supabaseMeals.length > 0) return supabaseMeals;
      } catch (error) {
        console.warn('Failed to fetch from Supabase, using local data');
      }
      return mealsData as Meal[];
    },
  });
};

export const useCreateMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meal: Omit<Meal, 'id'>) => mealService.createMeal(meal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
};

export const useUpdateMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, meal }: { id: string; meal: Partial<Meal> }) =>
      mealService.updateMeal(id, meal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
};

export const useDeleteMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mealService.deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
};

export const useImportMeals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meals: Meal[]) => mealService.importMeals(meals),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
};

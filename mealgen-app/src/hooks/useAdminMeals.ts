import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseHelpers } from '@/services/supabase';
import type { MealFormData } from '@/types';

export function useAdminMeals() {
  const queryClient = useQueryClient();

  const { data: meals, isLoading } = useQuery({
    queryKey: ['admin-meals'],
    queryFn: async () => {
      const { data } = await supabaseHelpers.getMeals();
      return data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (meal: MealFormData) => {
      const dbMeal = {
        name: meal.name,
        description: meal.description,
        image_url: meal.imageUrl,
        ingredients: meal.ingredients,
        instructions: meal.instructions,
        category: meal.category,
        preparation_time: meal.preparationTime || null,
        difficulty: meal.difficulty || null,
      };
      const { data } = await supabaseHelpers.createMeal(dbMeal);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-meals'] });
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, meal }: { id: string; meal: MealFormData }) => {
      const dbMeal = {
        name: meal.name,
        description: meal.description,
        image_url: meal.imageUrl,
        ingredients: meal.ingredients,
        instructions: meal.instructions,
        category: meal.category,
        preparation_time: meal.preparationTime || null,
        difficulty: meal.difficulty || null,
      };
      const { data } = await supabaseHelpers.updateMeal(id, dbMeal);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-meals'] });
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabaseHelpers.deleteMeal(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-meals'] });
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  return {
    meals: meals || [],
    isLoading,
    createMeal: createMutation.mutate,
    updateMeal: updateMutation.mutate,
    deleteMeal: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

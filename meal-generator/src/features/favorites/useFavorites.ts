import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { mealService } from '@/services/mealService';
import { useAppStore } from '@/stores/useAppStore';
import { Meal } from '@/types/meal';

export const useFavorites = () => {
  const { user } = useAppStore();
  const queryClient = useQueryClient();

  const { data: favoriteIds = [], isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('favorites')
        .select('meal_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map((f) => f.meal_id);
    },
    enabled: !!user,
  });

  const { data: favoriteMeals = [], isLoading: isLoadingMeals } = useQuery({
    queryKey: ['favoriteMeals', favoriteIds],
    queryFn: async () => {
      if (favoriteIds.length === 0) return [];
      const meals = await Promise.all(
        favoriteIds.map((id) => mealService.getById(id))
      );
      return meals.filter((m): m is Meal => m !== null);
    },
    enabled: favoriteIds.length > 0,
  });

  const addFavorite = useMutation({
    mutationFn: async (mealId: string) => {
      if (!user) throw new Error('Must be logged in');
      const { error } = await supabase.from('favorites').insert({
        user_id: user.id,
        meal_id: mealId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (mealId: string) => {
      if (!user) throw new Error('Must be logged in');
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('meal_id', mealId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const isFavorited = (mealId: string) => favoriteIds.includes(mealId);

  const toggleFavorite = async (mealId: string) => {
    if (isFavorited(mealId)) {
      await removeFavorite.mutateAsync(mealId);
    } else {
      await addFavorite.mutateAsync(mealId);
    }
  };

  return {
    favoriteMeals,
    favoriteIds,
    isLoading: isLoadingFavorites || isLoadingMeals,
    isFavorited,
    toggleFavorite,
    addFavorite: addFavorite.mutateAsync,
    removeFavorite: removeFavorite.mutateAsync,
  };
};

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { mealService } from '@/services/mealService';
import { useAppStore } from '@/stores/useAppStore';
import { Meal } from '@/types/meal';

interface HistoryEntry {
  meal: Meal;
  generatedAt: string;
}

export const useHistory = () => {
  const { user } = useAppStore();

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['history', user?.id],
    queryFn: async (): Promise<HistoryEntry[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_history')
        .select('meal_id, generated_at')
        .eq('user_id', user.id)
        .order('generated_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const meals = await Promise.all(
        data.map(async (entry) => {
          const meal = await mealService.getById(entry.meal_id);
          return meal
            ? { meal, generatedAt: entry.generated_at }
            : null;
        })
      );

      return meals.filter((entry): entry is HistoryEntry => entry !== null);
    },
    enabled: !!user,
  });

  return {
    history,
    isLoading,
  };
};

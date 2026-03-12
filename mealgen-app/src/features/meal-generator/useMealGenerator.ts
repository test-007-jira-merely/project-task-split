import { useAppStore } from '@/stores/useAppStore';
import { selectRandomMeal } from '@/utils/matching';
import { supabaseHelpers } from '@/services/supabase';

export function useMealGenerator() {
  const {
    meals,
    currentMeal,
    lastGeneratedMealId,
    setCurrentMeal,
    setLastGeneratedMealId,
    user,
    addHistoryEntry,
  } = useAppStore();

  const generateRandomMeal = async () => {
    const meal = selectRandomMeal(meals, lastGeneratedMealId);
    if (meal) {
      setCurrentMeal(meal);
      setLastGeneratedMealId(meal.id);

      // Add to history if authenticated
      if (user) {
        try {
          const { data } = await supabaseHelpers.addHistoryEntry(user.id, meal.id);
          if (data) {
            addHistoryEntry(data);
          }
        } catch (error) {
          console.error('Failed to add history entry:', error);
        }
      }
    }
  };

  return { currentMeal, generateRandomMeal };
}

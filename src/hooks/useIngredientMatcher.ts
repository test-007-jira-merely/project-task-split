import { useMemo } from 'react';
import { Meal, MealWithMatch } from '@/types/models';
import { filterMealsByIngredients } from '@/utils/matching';

export function useIngredientMatcher(meals: Meal[], ingredients: string[]) {
  const matchedMeals = useMemo(() => {
    return filterMealsByIngredients(meals, ingredients, 0) as MealWithMatch[];
  }, [meals, ingredients]);

  const fullMatches = useMemo(() => {
    return matchedMeals.filter((meal) => meal.matchPercentage === 100);
  }, [matchedMeals]);

  const partialMatches = useMemo(() => {
    return matchedMeals.filter((meal) => (meal.matchPercentage || 0) < 100 && (meal.matchPercentage || 0) > 0);
  }, [matchedMeals]);

  return { matchedMeals, fullMatches, partialMatches };
}

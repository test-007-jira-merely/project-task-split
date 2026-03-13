import { useMemo, useState } from 'react';
import { useAppStore } from '@stores/useAppStore';
import { useMeals } from '@hooks/useMeals';
import { filterMealsByIngredients } from '@utils/matching';
import type { MealCategory } from '@types/meal';

export function useIngredientFilter() {
  const { meals } = useMeals();
  const { selectedIngredients } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<MealCategory | null>(null);

  const filteredMatches = useMemo(() => {
    let filtered = meals;

    if (selectedCategory) {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }

    if (selectedIngredients.length === 0) {
      return filtered.map(meal => ({
        meal,
        matchPercentage: 0,
        matchedIngredients: [],
        missingIngredients: meal.ingredients,
      }));
    }

    return filterMealsByIngredients(filtered, selectedIngredients);
  }, [meals, selectedIngredients, selectedCategory]);

  return {
    matches: filteredMatches,
    selectedCategory,
    setSelectedCategory,
  };
}

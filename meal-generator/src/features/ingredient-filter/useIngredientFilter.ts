import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mealService } from '@/services/mealService';
import { useAppStore } from '@/stores/useAppStore';
import { MealMatch, MealCategory } from '@/types/meal';
import { enrichMealWithMatch } from '@/utils/matching';

interface FilterOptions {
  category?: MealCategory;
  sortBy?: 'match' | 'random' | 'category' | 'name';
}

export const useIngredientFilter = (options: FilterOptions = {}) => {
  const { ingredients } = useAppStore();

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['meals'],
    queryFn: mealService.getAll,
  });

  const filteredMeals: MealMatch[] = useMemo(() => {
    let result = meals.map((meal) => enrichMealWithMatch(meal, ingredients));

    if (ingredients.length > 0) {
      result = result.filter((meal) => meal.matchPercentage > 0);
    }

    if (options.category) {
      result = result.filter((meal) => meal.category === options.category);
    }

    switch (options.sortBy) {
      case 'match':
        result.sort((a, b) => b.matchPercentage - a.matchPercentage);
        break;
      case 'random':
        result.sort(() => Math.random() - 0.5);
        break;
      case 'category':
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => b.matchPercentage - a.matchPercentage);
    }

    return result;
  }, [meals, ingredients, options.category, options.sortBy]);

  const allIngredients = useMemo(() => {
    const ingredientSet = new Set<string>();
    meals.forEach((meal) => {
      meal.ingredients.forEach((ingredient) => {
        ingredientSet.add(ingredient);
      });
    });
    return Array.from(ingredientSet).sort();
  }, [meals]);

  return {
    filteredMeals,
    allIngredients,
    isLoading,
  };
};

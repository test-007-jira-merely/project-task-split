import { Meal, MealMatch, MealFilter, SortOption } from '@/types/meal';
import mealsData from '@/data/meals.json';
import {
  calculateMatchPercentage,
  getMatchedIngredients,
  getMissingIngredients,
} from '@/utils/ingredientUtils';

export const getAllMeals = async (): Promise<Meal[]> => {
  return mealsData as Meal[];
};

export const getRandomMeal = async (excludeIds: string[] = []): Promise<Meal | null> => {
  const meals = await getAllMeals();
  const available = meals.filter(m => !excludeIds.includes(m.id));

  if (available.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
};

export const findMealsByIngredients = (
  ingredients: string[],
  allMeals: Meal[]
): MealMatch[] => {
  if (ingredients.length === 0) return [];

  const matches: MealMatch[] = allMeals.map(meal => {
    const matchPercentage = calculateMatchPercentage(ingredients, meal.ingredients);
    const matchedIngredients = getMatchedIngredients(ingredients, meal.ingredients);
    const missingIngredients = getMissingIngredients(ingredients, meal.ingredients);

    return {
      meal,
      matchPercentage,
      matchedIngredients,
      missingIngredients,
    };
  }).filter(match => match.matchPercentage > 0);

  return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
};

export const filterMeals = (meals: Meal[], filters: MealFilter): Meal[] => {
  let filtered = [...meals];

  if (filters.category) {
    filtered = filtered.filter(m => m.category === filters.category);
  }

  if (filters.difficulty) {
    filtered = filtered.filter(m => m.difficulty === filters.difficulty);
  }

  if (filters.maxPrepTime) {
    filtered = filtered.filter(m => !m.prepTime || m.prepTime <= filters.maxPrepTime!);
  }

  return filtered;
};

export const sortMeals = <T extends Meal | MealMatch>(
  meals: T[],
  sortOption: SortOption
): T[] => {
  const sorted = [...meals];

  switch (sortOption) {
    case 'match':
      if (sorted.length > 0 && 'matchPercentage' in sorted[0]) {
        return (sorted as MealMatch[]).sort((a, b) => b.matchPercentage - a.matchPercentage) as T[];
      }
      return sorted;
    case 'random':
      return sorted.sort(() => Math.random() - 0.5);
    case 'category':
      return sorted.sort((a, b) => {
        const mealA = 'meal' in a ? a.meal : a as Meal;
        const mealB = 'meal' in b ? b.meal : b as Meal;
        return mealA.category.localeCompare(mealB.category);
      });
    case 'name':
      return sorted.sort((a, b) => {
        const mealA = 'meal' in a ? a.meal : a as Meal;
        const mealB = 'meal' in b ? b.meal : b as Meal;
        return mealA.name.localeCompare(mealB.name);
      });
    default:
      return sorted;
  }
};

export const getMealById = (id: string, allMeals: Meal[]): Meal | null => {
  return allMeals.find(m => m.id === id) || null;
};

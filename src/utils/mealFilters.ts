import { Meal, Category } from '@/types/models';

export function filterByCategory(meals: Meal[], category: Category | null): Meal[] {
  if (!category) return meals;
  return meals.filter((meal) => meal.category === category);
}

export function filterByDifficulty(
  meals: Meal[],
  difficulty: 'easy' | 'medium' | 'hard' | null
): Meal[] {
  if (!difficulty) return meals;
  return meals.filter((meal) => meal.difficulty === difficulty);
}

export function sortMeals(
  meals: Meal[],
  sortBy: 'match' | 'random' | 'category' | 'name'
): Meal[] {
  const sorted = [...meals];

  switch (sortBy) {
    case 'match':
      return sorted.sort((a: any, b: any) =>
        (b.matchPercentage || 0) - (a.matchPercentage || 0)
      );
    case 'random':
      return sorted.sort(() => Math.random() - 0.5);
    case 'category':
      return sorted.sort((a, b) => a.category.localeCompare(b.category));
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

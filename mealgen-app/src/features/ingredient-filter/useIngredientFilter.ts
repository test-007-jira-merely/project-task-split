import { useMemo, useEffect, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { filterMeals, sortMeals, getUniqueIngredients } from '@/utils/matching';
import type { MealFilters, SortOption } from '@/types';

export function useIngredientFilter() {
  const {
    meals,
    selectedIngredients,
    filteredMeals,
    setFilteredMeals,
    addIngredient,
    removeIngredient,
    clearIngredients,
  } = useAppStore();

  const [filters, setFilters] = useState<MealFilters>({});
  const [sortOption, setSortOption] = useState<SortOption>('match');

  useEffect(() => {
    const filtered = filterMeals(meals, selectedIngredients, filters);
    const sorted = sortMeals(filtered, sortOption);
    setFilteredMeals(sorted);
  }, [meals, selectedIngredients, filters, sortOption, setFilteredMeals]);

  const suggestions = useMemo(() =>
    getUniqueIngredients(meals),
    [meals]
  );

  return {
    selectedIngredients,
    filteredMeals,
    filters,
    sortOption,
    suggestions,
    addIngredient,
    removeIngredient,
    clearIngredients,
    setFilters,
    setSortOption,
  };
}

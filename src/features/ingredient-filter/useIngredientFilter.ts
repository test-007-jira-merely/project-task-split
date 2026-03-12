import { useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { ingredientMatcher } from '@/utils/matching';
import { Meal } from '@/types';
import mealsData from '@/data/meals.json';

export const useIngredientFilter = () => {
  const {
    selectedIngredients,
    filteredMeals,
    filters,
    addIngredient,
    removeIngredient,
    clearIngredients,
    setFilteredMeals,
    setFilters,
  } = useAppStore();

  const meals = mealsData as Meal[];
  const allIngredients = ingredientMatcher.getAllIngredients(meals);

  useEffect(() => {
    if (selectedIngredients.length === 0) {
      setFilteredMeals([]);
      return;
    }

    let filtered = ingredientMatcher.filterMealsByIngredients(meals, selectedIngredients);

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(m => m.category === filters.category);
    }

    // Apply difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(m => m.difficulty === filters.difficulty);
    }

    // Apply prep time filter
    if (filters.maxPrepTime) {
      filtered = filtered.filter(m => (m.prepTime || 0) <= filters.maxPrepTime!);
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'match':
          // Already sorted by match percentage
          break;
        case 'category':
          filtered.sort((a, b) => a.category.localeCompare(b.category));
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'random':
          filtered = filtered.sort(() => Math.random() - 0.5);
          break;
      }
    }

    setFilteredMeals(filtered);
  }, [selectedIngredients, filters, meals, setFilteredMeals]);

  const getSuggestions = (input: string) => {
    return ingredientMatcher.suggestIngredients(input, allIngredients);
  };

  return {
    selectedIngredients,
    filteredMeals,
    filters,
    addIngredient,
    removeIngredient,
    clearIngredients,
    setFilters,
    getSuggestions,
    allIngredients,
  };
};

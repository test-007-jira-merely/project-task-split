import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Meal, User } from '../types';

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Current Meal
  currentMeal: Meal | null;
  setCurrentMeal: (meal: Meal | null) => void;
  lastGeneratedMealId: string | null;
  setLastGeneratedMealId: (id: string | null) => void;

  // Ingredients
  selectedIngredients: string[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;

  // Filtered Meals
  filteredMeals: Meal[];
  setFilteredMeals: (meals: Meal[]) => void;

  // Loading States
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),

      // Theme
      theme: 'light',
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
          return { theme: newTheme };
        }),

      // Current Meal
      currentMeal: null,
      setCurrentMeal: (meal) => set({ currentMeal: meal }),
      lastGeneratedMealId: null,
      setLastGeneratedMealId: (id) => set({ lastGeneratedMealId: id }),

      // Ingredients
      selectedIngredients: [],
      addIngredient: (ingredient) =>
        set((state) => ({
          selectedIngredients: [...new Set([...state.selectedIngredients, ingredient.toLowerCase().trim()])],
        })),
      removeIngredient: (ingredient) =>
        set((state) => ({
          selectedIngredients: state.selectedIngredients.filter((i) => i !== ingredient),
        })),
      clearIngredients: () => set({ selectedIngredients: [] }),

      // Filtered Meals
      filteredMeals: [],
      setFilteredMeals: (meals) => set({ filteredMeals: meals }),

      // Loading States
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'mealgen-storage',
      partialize: (state) => ({
        theme: state.theme,
        selectedIngredients: state.selectedIngredients,
      }),
    }
  )
);

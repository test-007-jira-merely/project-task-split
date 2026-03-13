import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';
import { Meal } from '@/types/meal';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;

  // Theme state
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Meal state
  currentMeal: Meal | null;
  setCurrentMeal: (meal: Meal | null) => void;
  lastGeneratedMealId: string | null;
  setLastGeneratedMealId: (id: string | null) => void;

  // Ingredient state
  ingredients: string[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;

  // Loading state
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),

      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      // Meal
      currentMeal: null,
      setCurrentMeal: (meal) => set({ currentMeal: meal }),
      lastGeneratedMealId: null,
      setLastGeneratedMealId: (id) => set({ lastGeneratedMealId: id }),

      // Ingredients
      ingredients: [],
      addIngredient: (ingredient) =>
        set((state) => ({
          ingredients: [...state.ingredients, ingredient],
        })),
      removeIngredient: (ingredient) =>
        set((state) => ({
          ingredients: state.ingredients.filter((i) => i !== ingredient),
        })),
      clearIngredients: () => set({ ingredients: [] }),

      // Loading
      loading: false,
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'mealgen-storage',
      partialize: (state) => ({
        theme: state.theme,
        ingredients: state.ingredients,
      }),
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Meal, MealMatch } from '@/types/meal';
import type { User } from '@/types/user';

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

  // Ingredients state
  selectedIngredients: string[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;

  // Filtered meals state
  filteredMeals: MealMatch[];
  setFilteredMeals: (meals: MealMatch[]) => void;

  // Favorites state (IDs only, actual data from Supabase)
  favoriteIds: string[];
  setFavoriteIds: (ids: string[]) => void;
  addFavoriteId: (id: string) => void;
  removeFavoriteId: (id: string) => void;

  // Loading states
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
      selectedIngredients: [],
      addIngredient: (ingredient) =>
        set((state) => {
          const normalized = ingredient.toLowerCase().trim();
          if (state.selectedIngredients.some(i => i.toLowerCase() === normalized)) {
            return state;
          }
          return { selectedIngredients: [...state.selectedIngredients, ingredient] };
        }),
      removeIngredient: (ingredient) =>
        set((state) => ({
          selectedIngredients: state.selectedIngredients.filter(
            (i) => i.toLowerCase() !== ingredient.toLowerCase()
          ),
        })),
      clearIngredients: () => set({ selectedIngredients: [] }),

      // Filtered meals
      filteredMeals: [],
      setFilteredMeals: (meals) => set({ filteredMeals: meals }),

      // Favorites
      favoriteIds: [],
      setFavoriteIds: (ids) => set({ favoriteIds: ids }),
      addFavoriteId: (id) =>
        set((state) => ({
          favoriteIds: [...state.favoriteIds, id],
        })),
      removeFavoriteId: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((fid) => fid !== id),
        })),

      // Loading
      loading: false,
      setLoading: (loading) => set({ loading }),
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

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from '../types';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      theme: 'light',
      currentMeal: null,
      lastGeneratedMealId: null,
      ingredients: [],
      filteredMeals: [],
      favorites: [],
      history: [],
      loading: false,

      setUser: (user) => set({ user }),

      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          if (typeof window !== 'undefined') {
            if (newTheme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
          return { theme: newTheme };
        }),

      setTheme: (theme) =>
        set(() => {
          if (typeof window !== 'undefined') {
            if (theme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
          return { theme };
        }),

      setCurrentMeal: (currentMeal) => set({ currentMeal }),

      setLastGeneratedMealId: (lastGeneratedMealId) => set({ lastGeneratedMealId }),

      addIngredient: (ingredient) =>
        set((state) => {
          const normalized = ingredient.trim().toLowerCase();
          if (!normalized || state.ingredients.some((i) => i.toLowerCase() === normalized)) {
            return state;
          }
          return { ingredients: [...state.ingredients, ingredient.trim()] };
        }),

      removeIngredient: (ingredient) =>
        set((state) => ({
          ingredients: state.ingredients.filter((i) => i !== ingredient),
        })),

      clearIngredients: () => set({ ingredients: [] }),

      setFilteredMeals: (filteredMeals) => set({ filteredMeals }),

      setFavorites: (favorites) => set({ favorites }),

      addFavorite: (favorite) =>
        set((state) => ({
          favorites: [favorite, ...state.favorites],
        })),

      removeFavorite: (favoriteId) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== favoriteId),
        })),

      setHistory: (history) => set({ history }),

      addHistory: (historyItem) =>
        set((state) => ({
          history: [historyItem, ...state.history],
        })),

      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'mealgen-storage',
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);

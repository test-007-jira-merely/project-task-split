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

      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme: newTheme };
      }),

      setCurrentMeal: (currentMeal) => set({ currentMeal }),

      setLastGeneratedMealId: (lastGeneratedMealId) => set({ lastGeneratedMealId }),

      addIngredient: (ingredient) => set((state) => {
        const normalized = ingredient.toLowerCase().trim();
        if (normalized && !state.ingredients.includes(normalized)) {
          return { ingredients: [...state.ingredients, normalized] };
        }
        return state;
      }),

      removeIngredient: (ingredient) => set((state) => ({
        ingredients: state.ingredients.filter(i => i !== ingredient)
      })),

      clearIngredients: () => set({ ingredients: [] }),

      setFilteredMeals: (filteredMeals) => set({ filteredMeals }),

      setFavorites: (favorites) => set({ favorites }),

      addFavorite: (mealId) => set((state) => ({
        favorites: [...state.favorites, mealId]
      })),

      removeFavorite: (mealId) => set((state) => ({
        favorites: state.favorites.filter(id => id !== mealId)
      })),

      setHistory: (history) => set({ history }),

      addToHistory: (entry) => set((state) => ({
        history: [entry, ...state.history]
      })),

      setLoading: (loading) => set({ loading })
    }),
    {
      name: 'mealgen-storage',
      partialize: (state) => ({
        theme: state.theme,
        ingredients: state.ingredients
      })
    }
  )
);

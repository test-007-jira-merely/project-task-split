import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from '@/types/store';

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),

      // Theme state
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      // Meal generation state
      currentMeal: null,
      lastGeneratedMealId: null,
      setCurrentMeal: (meal) => set({ currentMeal: meal }),
      generateRandomMeal: (meals) => {
        if (meals.length === 0) return;

        const state = get();
        let availableMeals = meals;

        // Filter out the last generated meal if possible
        if (state.lastGeneratedMealId && meals.length > 1) {
          availableMeals = meals.filter(
            (m) => m.id !== state.lastGeneratedMealId
          );
        }

        // Select random meal
        const randomIndex = Math.floor(Math.random() * availableMeals.length);
        const selectedMeal = availableMeals[randomIndex];

        set({
          currentMeal: selectedMeal,
          lastGeneratedMealId: selectedMeal.id,
        });
      },

      // Ingredient filtering state
      ingredients: [],
      addIngredient: (ingredient) =>
        set((state) => {
          const normalized = ingredient.toLowerCase().trim();
          if (normalized && !state.ingredients.includes(normalized)) {
            return { ingredients: [...state.ingredients, normalized] };
          }
          return state;
        }),
      removeIngredient: (ingredient) =>
        set((state) => ({
          ingredients: state.ingredients.filter((i) => i !== ingredient),
        })),
      clearIngredients: () => set({ ingredients: [] }),

      // Filtered meals state
      filteredMeals: [],
      setFilteredMeals: (meals) => set({ filteredMeals: meals }),

      // Favorites state
      favorites: [],
      setFavorites: (favorites) => set({ favorites }),
      addFavorite: (mealId) =>
        set((state) => {
          if (!state.favorites.includes(mealId)) {
            return { favorites: [...state.favorites, mealId] };
          }
          return state;
        }),
      removeFavorite: (mealId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== mealId),
        })),
      isFavorite: (mealId) => get().favorites.includes(mealId),

      // History state
      history: [],
      setHistory: (history) => set({ history }),
      addToHistory: (mealId) =>
        set((state) => {
          // Add to beginning of history, remove duplicates
          const newHistory = [
            mealId,
            ...state.history.filter((id) => id !== mealId),
          ];
          // Keep only last 50 items
          return { history: newHistory.slice(0, 50) };
        }),

      // Loading state
      loading: false,
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'mealgen-storage',
      partialize: (state) => ({
        theme: state.theme,
        favorites: state.favorites,
        history: state.history,
      }),
    }
  )
);

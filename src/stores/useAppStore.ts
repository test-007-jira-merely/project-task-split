import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Theme } from './types';

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
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      toggleTheme: () =>
        set((state) => {
          const newTheme: Theme = state.theme === 'light' ? 'dark' : 'light';
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { theme: newTheme };
        }),

      // Current Meal
      currentMeal: null,
      setCurrentMeal: (meal) => set({ currentMeal: meal, lastGeneratedMealId: meal?.id || null }),
      lastGeneratedMealId: null,

      // Ingredients
      ingredients: [],
      addIngredient: (ingredient) =>
        set((state) => {
          const normalized = ingredient.toLowerCase().trim();
          if (state.ingredients.some(i => i.toLowerCase() === normalized)) {
            return state;
          }
          return { ingredients: [...state.ingredients, ingredient] };
        }),
      removeIngredient: (ingredient) =>
        set((state) => ({
          ingredients: state.ingredients.filter((i) => i !== ingredient),
        })),
      clearIngredients: () => set({ ingredients: [] }),

      // Filtered Meals
      filteredMeals: [],
      setFilteredMeals: (meals) => set({ filteredMeals: meals }),

      // Filters & Sorting
      filters: {},
      setFilters: (filters) => set({ filters }),
      sortOption: 'match',
      setSortOption: (option) => set({ sortOption: option }),

      // Favorites
      favorites: [],
      addFavorite: (mealId) =>
        set((state) => {
          if (state.favorites.includes(mealId)) return state;
          return { favorites: [...state.favorites, mealId] };
        }),
      removeFavorite: (mealId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== mealId),
        })),
      setFavorites: (favorites) => set({ favorites }),

      // History
      history: [],
      addToHistory: (mealId) =>
        set((state) => {
          const newHistory = [mealId, ...state.history.filter(id => id !== mealId)].slice(0, 50);
          return { history: newHistory };
        }),
      setHistory: (history) => set({ history }),

      // Loading
      loading: false,
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'meal-discovery-storage',
      partialize: (state) => ({
        theme: state.theme,
        favorites: state.favorites,
        history: state.history,
      }),
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState } from '../types/store';

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User slice
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: user !== null }),
      logout: () => set({ user: null, isAuthenticated: false, favorites: [], history: [] }),

      // Theme slice
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),

      // Meal slice
      currentMeal: null,
      lastGeneratedMealId: null,
      setCurrentMeal: (meal) => set({ currentMeal: meal }),
      setLastGeneratedMealId: (id) => set({ lastGeneratedMealId: id }),

      // Ingredients slice
      selectedIngredients: [],
      addIngredient: (ingredient) => {
        const normalized = ingredient.toLowerCase().trim();
        const current = get().selectedIngredients;
        if (!current.some(i => i.toLowerCase() === normalized)) {
          set({ selectedIngredients: [...current, ingredient] });
        }
      },
      removeIngredient: (ingredient) => {
        set((state) => ({
          selectedIngredients: state.selectedIngredients.filter(i => i !== ingredient),
        }));
      },
      clearIngredients: () => set({ selectedIngredients: [] }),

      // Filtered meals slice
      filteredMeals: [],
      setFilteredMeals: (meals) => set({ filteredMeals: meals }),

      // Favorites slice
      favorites: [],
      addFavorite: (mealId) => {
        const current = get().favorites;
        if (!current.includes(mealId)) {
          set({ favorites: [...current, mealId] });
        }
      },
      removeFavorite: (mealId) => {
        set((state) => ({
          favorites: state.favorites.filter(id => id !== mealId),
        }));
      },
      setFavorites: (mealIds) => set({ favorites: mealIds }),
      isFavorite: (mealId) => get().favorites.includes(mealId),

      // History slice
      history: [],
      addToHistory: (mealId) => {
        const current = get().history;
        const filtered = current.filter(id => id !== mealId);
        set({ history: [mealId, ...filtered].slice(0, 50) });
      },
      setHistory: (mealIds) => set({ history: mealIds }),

      // Loading slice
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

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Meal, Favorite, UserHistory } from '../types';

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
  ingredients: string[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;

  // Filtered meals state
  filteredMeals: Meal[];
  setFilteredMeals: (meals: Meal[]) => void;

  // Favorites state
  favorites: Favorite[];
  setFavorites: (favorites: Favorite[]) => void;
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (mealId: string) => void;

  // History state
  history: UserHistory[];
  setHistory: (history: UserHistory[]) => void;
  addToHistory: (entry: UserHistory) => void;

  // Loading state
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      // Meal
      currentMeal: null,
      setCurrentMeal: (meal) => set({ currentMeal: meal }),
      lastGeneratedMealId: null,
      setLastGeneratedMealId: (id) => set({ lastGeneratedMealId: id }),

      // Ingredients
      ingredients: [],
      addIngredient: (ingredient) => {
        const normalized = ingredient.toLowerCase().trim();
        const current = get().ingredients;
        if (!current.includes(normalized)) {
          set({ ingredients: [...current, normalized] });
        }
      },
      removeIngredient: (ingredient) => {
        const normalized = ingredient.toLowerCase().trim();
        set({ ingredients: get().ingredients.filter(i => i !== normalized) });
      },
      clearIngredients: () => set({ ingredients: [] }),

      // Filtered meals
      filteredMeals: [],
      setFilteredMeals: (meals) => set({ filteredMeals: meals }),

      // Favorites
      favorites: [],
      setFavorites: (favorites) => set({ favorites }),
      addFavorite: (favorite) => set({ favorites: [...get().favorites, favorite] }),
      removeFavorite: (mealId) => set({
        favorites: get().favorites.filter(f => f.mealId !== mealId)
      }),

      // History
      history: [],
      setHistory: (history) => set({ history }),
      addToHistory: (entry) => set({ history: [entry, ...get().history] }),

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

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@types/user';
import type { Meal } from '@types/meal';

interface AppState {
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Current meal
  currentMeal: Meal | null;
  setCurrentMeal: (meal: Meal | null) => void;
  lastGeneratedMealId: string | null;
  setLastGeneratedMealId: (id: string | null) => void;

  // Ingredients
  selectedIngredients: string[];
  setSelectedIngredients: (ingredients: string[]) => void;
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;

  // Filtered meals
  filteredMeals: Meal[];
  setFilteredMeals: (meals: Meal[]) => void;

  // Favorites (cached)
  favorites: Meal[];
  setFavorites: (meals: Meal[]) => void;
  addToFavorites: (meal: Meal) => void;
  removeFromFavorites: (mealId: string) => void;

  // History (cached)
  history: Meal[];
  setHistory: (meals: Meal[]) => void;
  addToHistory: (meal: Meal) => void;

  // Loading states
  loading: {
    meals: boolean;
    auth: boolean;
    favorites: boolean;
    history: boolean;
  };
  setLoading: (key: keyof AppState['loading'], value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
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

      // Current meal
      currentMeal: null,
      setCurrentMeal: (meal) => set({ currentMeal: meal }),
      lastGeneratedMealId: null,
      setLastGeneratedMealId: (id) => set({ lastGeneratedMealId: id }),

      // Ingredients
      selectedIngredients: [],
      setSelectedIngredients: (ingredients) => set({ selectedIngredients: ingredients }),
      addIngredient: (ingredient) => {
        const normalized = ingredient.toLowerCase().trim();
        const current = get().selectedIngredients;
        if (!current.some(i => i.toLowerCase() === normalized)) {
          set({ selectedIngredients: [...current, ingredient] });
        }
      },
      removeIngredient: (ingredient) => {
        set({
          selectedIngredients: get().selectedIngredients.filter(
            (i) => i.toLowerCase() !== ingredient.toLowerCase()
          ),
        });
      },
      clearIngredients: () => set({ selectedIngredients: [] }),

      // Filtered meals
      filteredMeals: [],
      setFilteredMeals: (meals) => set({ filteredMeals: meals }),

      // Favorites
      favorites: [],
      setFavorites: (meals) => set({ favorites: meals }),
      addToFavorites: (meal) => {
        const current = get().favorites;
        if (!current.find((m) => m.id === meal.id)) {
          set({ favorites: [...current, meal] });
        }
      },
      removeFromFavorites: (mealId) => {
        set({ favorites: get().favorites.filter((m) => m.id !== mealId) });
      },

      // History
      history: [],
      setHistory: (meals) => set({ history: meals }),
      addToHistory: (meal) => {
        const current = get().history;
        const filtered = current.filter((m) => m.id !== meal.id);
        set({ history: [meal, ...filtered].slice(0, 50) });
      },

      // Loading states
      loading: {
        meals: false,
        auth: false,
        favorites: false,
        history: false,
      },
      setLoading: (key, value) =>
        set((state) => ({
          loading: { ...state.loading, [key]: value },
        })),
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

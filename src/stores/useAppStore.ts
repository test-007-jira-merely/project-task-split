import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppStore } from '../../.contracts-beezi/stores/useAppStore.types';
import { Meal, User, Favorite, UserHistory, FilterOptions, MealWithMatch } from '@/types';

const initialState = {
  user: null,
  session: null,
  theme: 'light' as 'light' | 'dark',
  currentMeal: null,
  lastGeneratedMealId: null,
  selectedIngredients: [],
  filteredMeals: [],
  favorites: [],
  history: [],
  loading: {
    meals: false,
    favorites: false,
    history: false,
    auth: false,
  },
  filters: {},
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Auth
      setUser: (user: User | null) => set({ user }),
      setSession: (session: any) => set({ session }),
      logout: () => set({ user: null, session: null, favorites: [], history: [] }),

      // Theme
      setTheme: (theme: 'light' | 'dark') => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      // Meals
      setCurrentMeal: (meal: Meal | null) => set({ currentMeal: meal }),
      generateRandomMeal: (meals: Meal[]) => {
        const lastId = get().lastGeneratedMealId;
        const availableMeals = meals.filter(m => m.id !== lastId);
        const randomMeal = availableMeals[Math.floor(Math.random() * availableMeals.length)];
        set({ currentMeal: randomMeal, lastGeneratedMealId: randomMeal?.id || null });
      },
      setLastGeneratedMealId: (id: string | null) => set({ lastGeneratedMealId: id }),

      // Ingredients
      addIngredient: (ingredient: string) => {
        const normalized = ingredient.toLowerCase().trim();
        const current = get().selectedIngredients;
        if (!current.includes(normalized)) {
          set({ selectedIngredients: [...current, normalized] });
        }
      },
      removeIngredient: (ingredient: string) => {
        set((state) => ({
          selectedIngredients: state.selectedIngredients.filter(i => i !== ingredient),
        }));
      },
      clearIngredients: () => set({ selectedIngredients: [], filteredMeals: [] }),
      setFilteredMeals: (meals: MealWithMatch[]) => set({ filteredMeals: meals }),

      // Favorites
      setFavorites: (favorites: Favorite[]) => set({ favorites }),
      addFavorite: (favorite: Favorite) => {
        set((state) => ({ favorites: [...state.favorites, favorite] }));
      },
      removeFavoriteById: (mealId: string) => {
        set((state) => ({
          favorites: state.favorites.filter(f => f.meal_id !== mealId),
        }));
      },

      // History
      setHistory: (history: UserHistory[]) => set({ history }),
      addToHistory: (item: UserHistory) => {
        set((state) => ({ history: [item, ...state.history] }));
      },
      clearHistory: () => set({ history: [] }),

      // Loading
      setLoading: (key: keyof typeof initialState.loading, value: boolean) => {
        set((state) => ({
          loading: { ...state.loading, [key]: value },
        }));
      },

      // Filters
      setFilters: (filters: Partial<FilterOptions>) => {
        set((state) => ({ filters: { ...state.filters, ...filters } }));
      },
      clearFilters: () => set({ filters: {} }),

      // Reset
      resetState: () => set(initialState),
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

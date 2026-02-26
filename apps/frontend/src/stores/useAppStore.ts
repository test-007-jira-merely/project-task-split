import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Dish, MatchResult } from '@meal-platform/shared';

interface AppState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Current dish
  currentDish: Dish | null;
  setCurrentDish: (dish: Dish | null) => void;

  // Ingredient matching
  userIngredients: string[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;

  matchResults: MatchResult[];
  setMatchResults: (results: MatchResult[]) => void;

  // Favorites (client-side cache)
  favoriteIds: string[];
  addFavoriteId: (id: string) => void;
  removeFavoriteId: (id: string) => void;

  // History (client-side cache)
  historyIds: string[];
  addHistoryId: (id: string) => void;
  clearHistoryIds: () => void;

  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  error: string | null;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // Current dish
      currentDish: null,
      setCurrentDish: (dish) => set({ currentDish: dish }),

      // Ingredient matching
      userIngredients: [],
      addIngredient: (ingredient) =>
        set((state) => ({
          userIngredients: [...state.userIngredients, ingredient],
        })),
      removeIngredient: (ingredient) =>
        set((state) => ({
          userIngredients: state.userIngredients.filter((i) => i !== ingredient),
        })),
      clearIngredients: () => set({ userIngredients: [] }),

      matchResults: [],
      setMatchResults: (results) => set({ matchResults: results }),

      // Favorites
      favoriteIds: [],
      addFavoriteId: (id) =>
        set((state) => ({
          favoriteIds: [...state.favoriteIds, id],
        })),
      removeFavoriteId: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((fid) => fid !== id),
        })),

      // History
      historyIds: [],
      addHistoryId: (id) =>
        set((state) => ({
          historyIds: [id, ...state.historyIds.filter((hid) => hid !== id)].slice(0, 50),
        })),
      clearHistoryIds: () => set({ historyIds: [] }),

      // UI state
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      error: null,
      setError: (error) => set({ error }),
    }),
    {
      name: 'meal-platform-storage',
      partialize: (state) => ({
        theme: state.theme,
        favoriteIds: state.favoriteIds,
        historyIds: state.historyIds,
        userIngredients: state.userIngredients,
      }),
    }
  )
);

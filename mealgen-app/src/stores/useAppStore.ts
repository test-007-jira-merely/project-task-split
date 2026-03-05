// Zustand global store contract

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, AppActions, Theme, User, Meal, MealWithMatch, Favorite, UserHistory } from '../types';

// Complete store type
export type AppStore = AppState & AppActions;

/**
 * Main application store using Zustand
 *
 * This store manages all global state including:
 * - User authentication state
 * - Theme preferences
 * - Current meal and meal history
 * - Selected ingredients and filtered meals
 * - Favorites and history
 * - Loading states
 */
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      theme: 'light',
      currentMeal: null,
      lastGeneratedMealId: null,
      meals: [],
      filteredMeals: [],
      selectedIngredients: [],
      favorites: [],
      history: [],
      isLoadingMeals: false,
      isLoadingFavorites: false,
      isLoadingHistory: false,

      // User Actions
      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          favorites: [],
          history: [],
        });
      },

      // Theme Actions
      setTheme: (theme: Theme) => {
        set({ theme });
        // Apply theme to document
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(theme);
        }
      },

      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      // Meal Actions
      setCurrentMeal: (meal: Meal | null) => {
        set({ currentMeal: meal });
      },

      setLastGeneratedMealId: (id: string | null) => {
        set({ lastGeneratedMealId: id });
      },

      loadMeals: (meals: Meal[]) => {
        set({ meals });
      },

      setFilteredMeals: (meals: MealWithMatch[]) => {
        set({ filteredMeals: meals });
      },

      // Ingredient Actions
      addIngredient: (ingredient: string) => {
        const normalized = ingredient.toLowerCase().trim();
        const currentIngredients = get().selectedIngredients;

        if (!currentIngredients.some(i => i.toLowerCase() === normalized)) {
          set({
            selectedIngredients: [...currentIngredients, ingredient.trim()],
          });
        }
      },

      removeIngredient: (ingredient: string) => {
        set({
          selectedIngredients: get().selectedIngredients.filter(
            i => i !== ingredient
          ),
        });
      },

      clearIngredients: () => {
        set({ selectedIngredients: [] });
      },

      // Favorites Actions
      setFavorites: (favorites: Favorite[]) => {
        set({ favorites });
      },

      addFavorite: (favorite: Favorite) => {
        set({
          favorites: [...get().favorites, favorite],
        });
      },

      removeFavorite: (favoriteId: string) => {
        set({
          favorites: get().favorites.filter(f => f.id !== favoriteId),
        });
      },

      // History Actions
      setHistory: (history: UserHistory[]) => {
        set({ history });
      },

      addHistoryEntry: (entry: UserHistory) => {
        set({
          history: [entry, ...get().history],
        });
      },

      // Loading Actions
      setLoadingMeals: (loading: boolean) => {
        set({ isLoadingMeals: loading });
      },

      setLoadingFavorites: (loading: boolean) => {
        set({ isLoadingFavorites: loading });
      },

      setLoadingHistory: (loading: boolean) => {
        set({ isLoadingHistory: loading });
      },
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

// Selectors for optimized access
export const selectUser = (state: AppStore) => state.user;
export const selectIsAuthenticated = (state: AppStore) => state.isAuthenticated;
export const selectTheme = (state: AppStore) => state.theme;
export const selectCurrentMeal = (state: AppStore) => state.currentMeal;
export const selectMeals = (state: AppStore) => state.meals;
export const selectFilteredMeals = (state: AppStore) => state.filteredMeals;
export const selectSelectedIngredients = (state: AppStore) => state.selectedIngredients;
export const selectFavorites = (state: AppStore) => state.favorites;
export const selectHistory = (state: AppStore) => state.history;

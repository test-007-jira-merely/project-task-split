import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import type { Meal, MealWithMatch } from '../types/meal'
import { Theme } from '../utils/theme'

interface AppState {
  // Auth
  user: User | null
  setUser: (user: User | null) => void

  // Theme
  theme: Theme
  setTheme: (theme: Theme) => void

  // Meals
  meals: Meal[]
  setMeals: (meals: Meal[]) => void
  currentMeal: Meal | null
  setCurrentMeal: (meal: Meal | null) => void
  lastGeneratedMealId: string | null
  setLastGeneratedMealId: (id: string | null) => void

  // Ingredients
  ingredients: string[]
  addIngredient: (ingredient: string) => void
  removeIngredient: (ingredient: string) => void
  clearIngredients: () => void
  setIngredients: (ingredients: string[]) => void

  // Filtered Meals
  filteredMeals: MealWithMatch[]
  setFilteredMeals: (meals: MealWithMatch[]) => void

  // Favorites
  favoriteIds: string[]
  setFavoriteIds: (ids: string[]) => void
  addFavorite: (id: string) => void
  removeFavorite: (id: string) => void

  // History
  historyMealIds: string[]
  setHistoryMealIds: (ids: string[]) => void
  addToHistory: (id: string) => void

  // UI State
  loading: boolean
  setLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  setUser: (user) => set({ user }),

  // Theme
  theme: 'light',
  setTheme: (theme) => set({ theme }),

  // Meals
  meals: [],
  setMeals: (meals) => set({ meals }),
  currentMeal: null,
  setCurrentMeal: (currentMeal) => set({ currentMeal }),
  lastGeneratedMealId: null,
  setLastGeneratedMealId: (lastGeneratedMealId) => set({ lastGeneratedMealId }),

  // Ingredients
  ingredients: [],
  addIngredient: (ingredient) =>
    set((state) => ({
      ingredients: [...new Set([...state.ingredients, ingredient.toLowerCase().trim()])],
    })),
  removeIngredient: (ingredient) =>
    set((state) => ({
      ingredients: state.ingredients.filter((i) => i !== ingredient),
    })),
  clearIngredients: () => set({ ingredients: [] }),
  setIngredients: (ingredients) => set({ ingredients }),

  // Filtered Meals
  filteredMeals: [],
  setFilteredMeals: (filteredMeals) => set({ filteredMeals }),

  // Favorites
  favoriteIds: [],
  setFavoriteIds: (favoriteIds) => set({ favoriteIds }),
  addFavorite: (id) =>
    set((state) => ({
      favoriteIds: [...state.favoriteIds, id],
    })),
  removeFavorite: (id) =>
    set((state) => ({
      favoriteIds: state.favoriteIds.filter((fid) => fid !== id),
    })),

  // History
  historyMealIds: [],
  setHistoryMealIds: (historyMealIds) => set({ historyMealIds }),
  addToHistory: (id) =>
    set((state) => ({
      historyMealIds: [id, ...state.historyMealIds.filter((hid) => hid !== id)],
    })),

  // UI State
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  setError: (error) => set({ error }),
}))

import { create } from 'zustand';
import type { User, Meal, Theme } from '@/types';
import { storage } from '@/utils/storage';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;

  // Theme state
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;

  // Meal generator state
  currentMeal: Meal | null;
  lastGeneratedMealId: string | null;
  setCurrentMeal: (meal: Meal | null) => void;
  setLastGeneratedMealId: (id: string | null) => void;

  // Ingredient filter state
  ingredients: string[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;

  // Loading states
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),

  // Theme
  theme: storage.get<Theme>('theme', 'light'),
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    storage.set('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    return { theme: newTheme };
  }),
  setTheme: (theme) => {
    storage.set('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },

  // Meal generator
  currentMeal: null,
  lastGeneratedMealId: null,
  setCurrentMeal: (meal) => set({ currentMeal: meal }),
  setLastGeneratedMealId: (id) => set({ lastGeneratedMealId: id }),

  // Ingredients
  ingredients: [],
  addIngredient: (ingredient) => set((state) => {
    const normalized = ingredient.trim().toLowerCase();
    if (normalized && !state.ingredients.includes(normalized)) {
      return { ingredients: [...state.ingredients, normalized] };
    }
    return state;
  }),
  removeIngredient: (ingredient) => set((state) => ({
    ingredients: state.ingredients.filter(i => i !== ingredient),
  })),
  clearIngredients: () => set({ ingredients: [] }),

  // Loading
  isGenerating: false,
  setIsGenerating: (loading) => set({ isGenerating: loading }),
}));

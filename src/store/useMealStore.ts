import { create } from 'zustand';
import type { Meal, MealMatch } from '../types/meal';
import mealsData from '../data/meals.json';
import { filterMealsByIngredients, removeDuplicateIngredients } from '../utils/matching';

interface MealState {
  // State
  currentDish: Meal | null;
  ingredients: string[];
  filteredMeals: MealMatch[];
  favorites: string[];
  theme: 'light' | 'dark';
  loading: boolean;
  lastGeneratedId: string | null;

  // Actions
  generateRandomMeal: () => void;
  generateMealFromIngredients: () => void;
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
  toggleFavorite: (mealId: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (loading: boolean) => void;
  initializeTheme: () => void;
}

const meals = mealsData as Meal[];

export const useMealStore = create<MealState>((set, get) => ({
  // Initial state
  currentDish: null,
  ingredients: [],
  filteredMeals: [],
  favorites: JSON.parse(localStorage.getItem('mealgen-favorites') || '[]'),
  theme: 'light',
  loading: false,
  lastGeneratedId: null,

  // Generate a random meal (avoid consecutive repeats)
  generateRandomMeal: () => {
    set({ loading: true });

    setTimeout(() => {
      const { lastGeneratedId } = get();
      let availableMeals = meals;

      // If there's a last generated meal and more than one meal available, exclude it
      if (lastGeneratedId && meals.length > 1) {
        availableMeals = meals.filter(meal => meal.id !== lastGeneratedId);
      }

      const randomIndex = Math.floor(Math.random() * availableMeals.length);
      const selectedMeal = availableMeals[randomIndex];

      set({
        currentDish: selectedMeal,
        lastGeneratedId: selectedMeal.id,
        loading: false,
        filteredMeals: []
      });
    }, 300);
  },

  // Generate meal based on available ingredients
  generateMealFromIngredients: () => {
    const { ingredients } = get();

    if (ingredients.length === 0) {
      return;
    }

    set({ loading: true });

    setTimeout(() => {
      const matches = filterMealsByIngredients(meals, ingredients);

      if (matches.length > 0) {
        // Prioritize full matches (100%), then pick randomly from top matches
        const fullMatches = matches.filter(m => m.matchPercentage === 100);
        const topMatches = fullMatches.length > 0 ? fullMatches : matches.slice(0, 5);
        const randomMatch = topMatches[Math.floor(Math.random() * topMatches.length)];

        set({
          currentDish: randomMatch,
          lastGeneratedId: randomMatch.id,
          filteredMeals: matches,
          loading: false
        });
      } else {
        set({
          currentDish: null,
          filteredMeals: [],
          loading: false
        });
      }
    }, 300);
  },

  // Add ingredient to the list
  addIngredient: (ingredient: string) => {
    const trimmed = ingredient.trim();
    if (!trimmed) return;

    const { ingredients } = get();
    const updated = [...ingredients, trimmed];
    const unique = removeDuplicateIngredients(updated);

    set({ ingredients: unique });

    // Auto-filter meals when ingredients change
    const matches = filterMealsByIngredients(meals, unique);
    set({ filteredMeals: matches });
  },

  // Remove ingredient from the list
  removeIngredient: (ingredient: string) => {
    const { ingredients } = get();
    const updated = ingredients.filter(i =>
      i.toLowerCase() !== ingredient.toLowerCase()
    );

    set({ ingredients: updated });

    // Update filtered meals
    if (updated.length > 0) {
      const matches = filterMealsByIngredients(meals, updated);
      set({ filteredMeals: matches });
    } else {
      set({ filteredMeals: [] });
    }
  },

  // Clear all ingredients
  clearIngredients: () => {
    set({
      ingredients: [],
      filteredMeals: [],
      currentDish: null
    });
  },

  // Toggle meal favorite status
  toggleFavorite: (mealId: string) => {
    const { favorites } = get();
    const updated = favorites.includes(mealId)
      ? favorites.filter(id => id !== mealId)
      : [...favorites, mealId];

    set({ favorites: updated });
    localStorage.setItem('mealgen-favorites', JSON.stringify(updated));
  },

  // Set theme
  setTheme: (theme: 'light' | 'dark') => {
    set({ theme });
    localStorage.setItem('mealgen-theme', theme);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  // Set loading state
  setLoading: (loading: boolean) => {
    set({ loading });
  },

  // Initialize theme from localStorage or system preference
  initializeTheme: () => {
    const stored = localStorage.getItem('mealgen-theme') as 'light' | 'dark' | null;

    if (stored) {
      get().setTheme(stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      get().setTheme(prefersDark ? 'dark' : 'light');
    }
  }
}));

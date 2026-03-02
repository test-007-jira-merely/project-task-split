import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Meal, MealMatch } from '../types/meal';
import mealsData from '../data/meals.json';
import { filterMealsByIngredients } from '../utils/matching';

interface MealStore {
  // State
  currentDish: Meal | null;
  lastDishId: string | null;
  ingredients: string[];
  filteredMeals: MealMatch[];
  favorites: string[];
  theme: 'light' | 'dark';
  loading: boolean;

  // Actions
  generateRandomMeal: () => void;
  setCurrentDish: (dish: Meal | null) => void;
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
  filterMeals: () => void;
  generateMealFromIngredients: () => void;
  toggleFavorite: (mealId: string) => void;
  toggleTheme: () => void;
  setLoading: (loading: boolean) => void;
}

const meals = mealsData as Meal[];

export const useMealStore = create<MealStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentDish: null,
      lastDishId: null,
      ingredients: [],
      filteredMeals: [],
      favorites: [],
      theme: 'light',
      loading: false,

      // Generate a random meal that's different from the last one
      generateRandomMeal: () => {
        set({ loading: true });

        setTimeout(() => {
          const { lastDishId } = get();
          let availableMeals = meals;

          // Filter out the last dish to prevent consecutive duplicates
          if (lastDishId) {
            availableMeals = meals.filter(meal => meal.id !== lastDishId);
          }

          const randomIndex = Math.floor(Math.random() * availableMeals.length);
          const selectedMeal = availableMeals[randomIndex];

          set({
            currentDish: selectedMeal,
            lastDishId: selectedMeal.id,
            loading: false,
          });
        }, 300);
      },

      setCurrentDish: (dish) => {
        set({ currentDish: dish, lastDishId: dish?.id || null });
      },

      addIngredient: (ingredient) => {
        const trimmed = ingredient.trim();
        if (trimmed && !get().ingredients.includes(trimmed)) {
          set(state => ({
            ingredients: [...state.ingredients, trimmed],
          }));
          // Auto-filter when ingredients change
          get().filterMeals();
        }
      },

      removeIngredient: (ingredient) => {
        set(state => ({
          ingredients: state.ingredients.filter(ing => ing !== ingredient),
        }));
        // Auto-filter when ingredients change
        get().filterMeals();
      },

      clearIngredients: () => {
        set({ ingredients: [], filteredMeals: [] });
      },

      filterMeals: () => {
        const { ingredients } = get();
        if (ingredients.length === 0) {
          set({ filteredMeals: [] });
          return;
        }

        const matches = filterMealsByIngredients(meals, ingredients, 0);
        set({ filteredMeals: matches });
      },

      generateMealFromIngredients: () => {
        set({ loading: true });

        setTimeout(() => {
          const { filteredMeals, lastDishId } = get();

          if (filteredMeals.length === 0) {
            set({ loading: false });
            return;
          }

          // Prefer 100% matches, then fall back to partial matches
          const perfectMatches = filteredMeals.filter(m => m.matchPercentage === 100);
          let availableMeals = perfectMatches.length > 0 ? perfectMatches : filteredMeals;

          // Filter out last dish
          if (lastDishId) {
            const filtered = availableMeals.filter(meal => meal.id !== lastDishId);
            if (filtered.length > 0) {
              availableMeals = filtered;
            }
          }

          const randomIndex = Math.floor(Math.random() * availableMeals.length);
          const selectedMeal = availableMeals[randomIndex];

          set({
            currentDish: selectedMeal,
            lastDishId: selectedMeal.id,
            loading: false,
          });
        }, 300);
      },

      toggleFavorite: (mealId) => {
        set(state => ({
          favorites: state.favorites.includes(mealId)
            ? state.favorites.filter(id => id !== mealId)
            : [...state.favorites, mealId],
        }));
      },

      toggleTheme: () => {
        set(state => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }));
      },

      setLoading: (loading) => {
        set({ loading });
      },
    }),
    {
      name: 'meal-store',
      partialize: (state) => ({
        favorites: state.favorites,
        theme: state.theme,
      }),
    }
  )
);

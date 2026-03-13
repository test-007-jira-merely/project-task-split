import { create } from 'zustand';
import { Meal, MealWithMatch } from '@/types/models';

interface MealState {
  currentMeal: Meal | null;
  lastGeneratedMealId: string | null;
  ingredients: string[];
  filteredMeals: MealWithMatch[];
  selectedCategory: string | null;
  loading: boolean;

  setCurrentMeal: (meal: Meal | null) => void;
  setLastGeneratedMealId: (id: string | null) => void;
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
  setFilteredMeals: (meals: MealWithMatch[]) => void;
  setSelectedCategory: (category: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useMealStore = create<MealState>((set) => ({
  currentMeal: null,
  lastGeneratedMealId: null,
  ingredients: [],
  filteredMeals: [],
  selectedCategory: null,
  loading: false,

  setCurrentMeal: (meal) => set({ currentMeal: meal }),
  setLastGeneratedMealId: (id) => set({ lastGeneratedMealId: id }),

  addIngredient: (ingredient) =>
    set((state) => {
      const normalized = ingredient.toLowerCase().trim();
      if (!normalized || state.ingredients.includes(normalized)) {
        return state;
      }
      return { ingredients: [...state.ingredients, normalized] };
    }),

  removeIngredient: (ingredient) =>
    set((state) => ({
      ingredients: state.ingredients.filter((i) => i !== ingredient),
    })),

  clearIngredients: () => set({ ingredients: [] }),

  setFilteredMeals: (meals) => set({ filteredMeals: meals }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setLoading: (loading) => set({ loading }),
}));

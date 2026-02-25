import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IngredientState {
  ingredients: string[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
  savedSets: Array<{ name: string; ingredients: string[] }>;
  saveIngredientSet: (name: string) => void;
  loadIngredientSet: (name: string) => void;
  deleteIngredientSet: (name: string) => void;
}

export const useIngredientStore = create<IngredientState>()(
  persist(
    (set, get) => ({
      ingredients: [],

      addIngredient: (ingredient) => {
        const trimmed = ingredient.trim().toLowerCase();
        if (!trimmed) return;

        set((state) => {
          if (state.ingredients.includes(trimmed)) return state;
          return { ingredients: [...state.ingredients, trimmed] };
        });
      },

      removeIngredient: (ingredient) =>
        set((state) => ({
          ingredients: state.ingredients.filter((i) => i !== ingredient),
        })),

      clearIngredients: () => set({ ingredients: [] }),

      savedSets: [],

      saveIngredientSet: (name) => {
        const { ingredients, savedSets } = get();
        if (ingredients.length === 0) return;

        const newSet = { name, ingredients: [...ingredients] };
        const filtered = savedSets.filter((s) => s.name !== name);
        set({ savedSets: [...filtered, newSet] });
      },

      loadIngredientSet: (name) => {
        const { savedSets } = get();
        const set = savedSets.find((s) => s.name === name);
        if (set) {
          set({ ingredients: [...set.ingredients] });
        }
      },

      deleteIngredientSet: (name) =>
        set((state) => ({
          savedSets: state.savedSets.filter((s) => s.name !== name),
        })),
    }),
    {
      name: 'ingredient-storage',
    }
  )
);

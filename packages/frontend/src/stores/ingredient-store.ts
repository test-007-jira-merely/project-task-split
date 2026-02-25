import { create } from 'zustand';
import { MatchScore } from '@meal-platform/shared';

interface IngredientState {
  selectedIngredients: string[];
  matchResults: MatchScore[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
  setMatchResults: (results: MatchScore[]) => void;
}

export const useIngredientStore = create<IngredientState>((set) => ({
  selectedIngredients: [],
  matchResults: [],

  addIngredient: (ingredient) =>
    set((state) => {
      const trimmed = ingredient.trim().toLowerCase();
      if (!trimmed || state.selectedIngredients.includes(trimmed)) {
        return state;
      }
      return { selectedIngredients: [...state.selectedIngredients, trimmed] };
    }),

  removeIngredient: (ingredient) =>
    set((state) => ({
      selectedIngredients: state.selectedIngredients.filter((i) => i !== ingredient),
    })),

  clearIngredients: () => set({ selectedIngredients: [], matchResults: [] }),

  setMatchResults: (results) => set({ matchResults: results }),
}));

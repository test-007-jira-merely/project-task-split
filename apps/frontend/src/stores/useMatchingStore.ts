import { create } from 'zustand';
import { IngredientMatch } from '@meal-platform/shared';
import { persist } from 'zustand/middleware';

interface MatchingStore {
  userIngredients: string[];
  matches: IngredientMatch[];
  isMatching: boolean;
  error: string | null;

  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
  setMatches: (matches: IngredientMatch[]) => void;
  setMatching: (isMatching: boolean) => void;
  setError: (error: string | null) => void;
  hasIngredients: () => boolean;
  ingredientCount: () => number;
}

export const useMatchingStore = create<MatchingStore>()(
  persist(
    (set, get) => ({
      userIngredients: [],
      matches: [],
      isMatching: false,
      error: null,

      addIngredient: (ingredient) =>
        set((state) => {
          const normalized = ingredient.toLowerCase().trim();
          if (!state.userIngredients.includes(normalized)) {
            return { userIngredients: [...state.userIngredients, normalized] };
          }
          return state;
        }),

      removeIngredient: (ingredient) =>
        set((state) => ({
          userIngredients: state.userIngredients.filter((i) => i !== ingredient),
        })),

      clearIngredients: () => set({ userIngredients: [], matches: [] }),

      setMatches: (matches) => set({ matches }),

      setMatching: (isMatching) => set({ isMatching }),

      setError: (error) => set({ error }),

      hasIngredients: () => get().userIngredients.length > 0,

      ingredientCount: () => get().userIngredients.length,
    }),
    {
      name: 'matching-store',
      partialize: (state) => ({ userIngredients: state.userIngredients }),
    }
  )
);

import { create } from 'zustand';
import { Dish } from '@meal-platform/shared-types';

interface DishState {
  currentDish: Dish | null;
  setCurrentDish: (dish: Dish | null) => void;
  dishHistory: Dish[];
  addToDishHistory: (dish: Dish) => void;
}

export const useDishStore = create<DishState>((set) => ({
  currentDish: null,
  setCurrentDish: (dish) => set({ currentDish: dish }),

  dishHistory: [],
  addToDishHistory: (dish) =>
    set((state) => {
      // Avoid duplicates
      const exists = state.dishHistory.some((d) => d.id === dish.id);
      if (exists) return state;

      // Keep last 50 items
      const newHistory = [dish, ...state.dishHistory].slice(0, 50);
      return { dishHistory: newHistory };
    }),
}));

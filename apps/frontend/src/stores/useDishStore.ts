import { create } from 'zustand';
import { Dish } from '@meal-platform/shared';
import { persist } from 'zustand/middleware';

interface DishStore {
  currentDish: Dish | null;
  dishHistory: Dish[];
  isLoading: boolean;
  error: string | null;

  setCurrentDish: (dish: Dish | null) => void;
  addToHistory: (dish: Dish) => void;
  clearHistory: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  getRecentDishes: (limit: number) => Dish[];
}

export const useDishStore = create<DishStore>()(
  persist(
    (set, get) => ({
      currentDish: null,
      dishHistory: [],
      isLoading: false,
      error: null,

      setCurrentDish: (dish) => set({ currentDish: dish }),

      addToHistory: (dish) =>
        set((state) => {
          const newHistory = [dish, ...state.dishHistory.filter((d) => d.id !== dish.id)].slice(
            0,
            20
          );
          return { dishHistory: newHistory };
        }),

      clearHistory: () => set({ dishHistory: [] }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      getRecentDishes: (limit) => get().dishHistory.slice(0, limit),
    }),
    {
      name: 'dish-store',
      partialize: (state) => ({ dishHistory: state.dishHistory }),
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Dish } from '@meal-platform/shared';

interface DishState {
  currentDish: Dish | null;
  dishHistory: Dish[];
  favorites: Set<string>;
  setCurrentDish: (dish: Dish) => void;
  addToHistory: (dish: Dish) => void;
  toggleFavorite: (dishId: string) => void;
  isFavorite: (dishId: string) => boolean;
  clearHistory: () => void;
}

export const useDishStore = create<DishState>()(
  persist(
    (set, get) => ({
      currentDish: null,
      dishHistory: [],
      favorites: new Set<string>(),

      setCurrentDish: (dish) => set({ currentDish: dish }),

      addToHistory: (dish) =>
        set((state) => {
          // Avoid duplicates - check if dish is already in recent history
          const isDuplicate = state.dishHistory.slice(-5).some((d) => d.id === dish.id);
          if (isDuplicate) return state;

          // Keep max 20 items in history
          const newHistory = [...state.dishHistory, dish].slice(-20);
          return { dishHistory: newHistory, currentDish: dish };
        }),

      toggleFavorite: (dishId) =>
        set((state) => {
          const newFavorites = new Set(state.favorites);
          if (newFavorites.has(dishId)) {
            newFavorites.delete(dishId);
          } else {
            newFavorites.add(dishId);
          }
          return { favorites: newFavorites };
        }),

      isFavorite: (dishId) => get().favorites.has(dishId),

      clearHistory: () => set({ dishHistory: [], currentDish: null }),
    }),
    {
      name: 'dish-storage',
      partialize: (state) => ({
        favorites: Array.from(state.favorites),
        dishHistory: state.dishHistory,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.favorites)) {
          state.favorites = new Set(state.favorites as unknown as string[]);
        }
      },
    }
  )
);

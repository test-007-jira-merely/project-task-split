import { create } from 'zustand';
import { UserFavorite, UserHistory } from '@meal-platform/shared';

interface UserActivityStore {
  favorites: UserFavorite[];
  history: UserHistory[];
  isLoading: boolean;
  error: string | null;

  setFavorites: (favorites: UserFavorite[]) => void;
  addFavorite: (favorite: UserFavorite) => void;
  removeFavorite: (dishId: string) => void;
  setHistory: (history: UserHistory[]) => void;
  addHistoryEntry: (entry: UserHistory) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  isFavorite: (dishId: string) => boolean;
  getFavoriteCount: () => number;
}

export const useUserActivityStore = create<UserActivityStore>()((set, get) => ({
  favorites: [],
  history: [],
  isLoading: false,
  error: null,

  setFavorites: (favorites) => set({ favorites }),

  addFavorite: (favorite) =>
    set((state) => ({
      favorites: [...state.favorites, favorite],
    })),

  removeFavorite: (dishId) =>
    set((state) => ({
      favorites: state.favorites.filter((f) => f.dishId !== dishId),
    })),

  setHistory: (history) => set({ history }),

  addHistoryEntry: (entry) =>
    set((state) => ({
      history: [entry, ...state.history],
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  isFavorite: (dishId) => get().favorites.some((f) => f.dishId === dishId),

  getFavoriteCount: () => get().favorites.length,
}));

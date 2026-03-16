import { create } from 'zustand';
import { Meal } from '../types';

type Theme = 'light' | 'dark' | 'system';

interface AppState {
  user: any; // Replace with actual User type
  theme: Theme;
  currentMeal: Meal | null;
  setTheme: (theme: Theme) => void;
  setCurrentMeal: (meal: Meal | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  theme: 'system',
  currentMeal: null,
  setTheme: (theme) => set({ theme }),
  setCurrentMeal: (meal) => set({ currentMeal: meal }),
}));

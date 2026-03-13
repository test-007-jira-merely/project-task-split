import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Theme, User, Meal, UserHistory } from '@/types';

interface AppStore extends AppState {
  setUser: (user: User | null) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setCurrentMeal: (meal: Meal | null) => void;
  setLastGeneratedMealId: (id: string | null) => void;
  setIngredients: (ingredients: string[]) => void;
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  setFilteredMeals: (meals: any[]) => void;
  setFavorites: (favorites: string[]) => void;
  addFavorite: (mealId: string) => void;
  removeFavorite: (mealId: string) => void;
  setHistory: (history: UserHistory[]) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState: AppState = {
  user: null,
  theme: 'light',
  currentMeal: null,
  lastGeneratedMealId: null,
  ingredients: [],
  filteredMeals: [],
  favorites: [],
  history: [],
  loading: false,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user) => set({ user }),
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { theme: newTheme };
        }),
      setCurrentMeal: (meal) => set({ currentMeal: meal }),
      setLastGeneratedMealId: (id) => set({ lastGeneratedMealId: id }),
      setIngredients: (ingredients) => set({ ingredients }),
      addIngredient: (ingredient) =>
        set((state) => ({
          ingredients: [...state.ingredients, ingredient],
        })),
      removeIngredient: (ingredient) =>
        set((state) => ({
          ingredients: state.ingredients.filter((i) => i !== ingredient),
        })),
      setFilteredMeals: (meals) => set({ filteredMeals: meals }),
      setFavorites: (favorites) => set({ favorites }),
      addFavorite: (mealId) =>
        set((state) => ({
          favorites: [...state.favorites, mealId],
        })),
      removeFavorite: (mealId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== mealId),
        })),
      setHistory: (history) => set({ history }),
      setLoading: (loading) => set({ loading }),
      reset: () => set(initialState),
    }),
    {
      name: 'mealgen-storage',
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);

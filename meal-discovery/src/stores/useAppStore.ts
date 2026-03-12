import { create } from 'zustand';
import { AppState } from '@/types/store';

const getInitialTheme = (): 'light' | 'dark' => {
  const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useAppStore = create<AppState>((set) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),

  // Theme state
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    return { theme: newTheme };
  }),

  // Meal generator state
  currentMeal: null,
  lastGeneratedMealId: null,
  setCurrentMeal: (meal) => set({ currentMeal: meal }),
  setLastGeneratedMealId: (id) => set({ lastGeneratedMealId: id }),

  // Ingredient filter state
  ingredients: [],
  addIngredient: (ingredient) => set((state) => {
    const normalized = ingredient.toLowerCase().trim();
    if (!state.ingredients.includes(normalized)) {
      return { ingredients: [...state.ingredients, normalized] };
    }
    return state;
  }),
  removeIngredient: (ingredient) => set((state) => ({
    ingredients: state.ingredients.filter((i) => i !== ingredient),
  })),
  clearIngredients: () => set({ ingredients: [] }),

  // Filtered meals state
  filteredMeals: [],
  setFilteredMeals: (meals) => set({ filteredMeals: meals }),

  // Favorites state
  favorites: [],
  addFavorite: (mealId) => set((state) => {
    if (!state.favorites.includes(mealId)) {
      return { favorites: [...state.favorites, mealId] };
    }
    return state;
  }),
  removeFavorite: (mealId) => set((state) => ({
    favorites: state.favorites.filter((id) => id !== mealId),
  })),
  setFavorites: (favorites) => set({ favorites }),

  // History state
  history: [],
  addToHistory: (mealId) => set((state) => ({
    history: [mealId, ...state.history.filter((id) => id !== mealId)].slice(0, 50),
  })),
  setHistory: (history) => set({ history }),

  // Loading state
  loading: false,
  setLoading: (loading) => set({ loading }),
}));

// Initialize theme on load
const initialTheme = getInitialTheme();
document.documentElement.classList.toggle('dark', initialTheme === 'dark');

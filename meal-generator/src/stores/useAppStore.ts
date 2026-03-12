import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppStore } from './types';

const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false, favorites: [], history: [] }),

      // Theme State
      theme: 'system',
      effectiveTheme: 'light',
      setTheme: (theme) => {
        const effectiveTheme = theme === 'system'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          : theme;
        set({ theme, effectiveTheme });

        if (effectiveTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      // Meal State
      currentMeal: null,
      lastGeneratedMealId: null,
      isGenerating: false,
      setCurrentMeal: (currentMeal) => set({ currentMeal }),
      setLastGeneratedMealId: (lastGeneratedMealId) => set({ lastGeneratedMealId }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),

      // Ingredient State
      selectedIngredients: [],
      filteredMeals: [],
      addIngredient: (ingredient) => {
        const normalized = ingredient.toLowerCase().trim();
        const current = get().selectedIngredients;
        if (!current.includes(normalized)) {
          set({ selectedIngredients: [...current, normalized] });
        }
      },
      removeIngredient: (ingredient) => {
        set({
          selectedIngredients: get().selectedIngredients.filter(i => i !== ingredient)
        });
      },
      clearIngredients: () => set({ selectedIngredients: [], filteredMeals: [] }),
      setFilteredMeals: (filteredMeals) => set({ filteredMeals }),

      // Favorites State
      favorites: [],
      setFavorites: (favorites) => set({ favorites }),
      addFavorite: (favorite) => set({ favorites: [...get().favorites, favorite] }),
      removeFavorite: (favoriteId) => {
        set({ favorites: get().favorites.filter(f => f.id !== favoriteId) });
      },
      isFavorite: (mealId) => {
        return get().favorites.some(f => f.mealId === mealId);
      },

      // History State
      history: [],
      setHistory: (history) => set({ history }),
      addHistoryEntry: (entry) => set({ history: [entry, ...get().history] }),

      // UI State
      isSidebarOpen: false,
      isModalOpen: false,
      modalContent: null,
      toggleSidebar: () => set({ isSidebarOpen: !get().isSidebarOpen }),
      openModal: (content) => set({ isModalOpen: true, modalContent: content }),
      closeModal: () => set({ isModalOpen: false, modalContent: null }),
    }),
    {
      name: 'mealgen-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAppStore;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabaseClient';

// ============================================================================
// Types
// ============================================================================

export interface Meal {
  id: string;
  name: string;
  category: string;
  area: string;
  instructions: string;
  thumbnail: string;
  tags: string | null;
  youtube: string | null;
  ingredients: Array<{ ingredient: string; measure: string }>;
  source: string | null;
  imageSource: string | null;
  creativeCommonsConfirmed: string | null;
  dateModified: string | null;
}

export interface User {
  id: string;
  email: string;
}

export type ThemeType = 'light' | 'dark' | 'system';

// ============================================================================
// State Slices
// ============================================================================

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

interface ThemeState {
  theme: ThemeType;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: ThemeType) => void;
}

interface MealState {
  currentMeal: Meal | null;
  lastGeneratedMealId: string | null;
  setCurrentMeal: (meal: Meal | null) => void;
  generateRandomMeal: () => Promise<void>;
}

interface IngredientState {
  ingredients: string[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
}

interface FilteredMealsState {
  filteredMeals: Meal[];
  setFilteredMeals: (meals: Meal[]) => void;
  filterByIngredients: (ingredients: string[]) => Promise<void>;
}

interface FavoritesState {
  favorites: string[];
  favoriteMeals: Meal[];
  loadFavorites: () => Promise<void>;
  addFavorite: (mealId: string) => Promise<void>;
  removeFavorite: (mealId: string) => Promise<void>;
  isFavorite: (mealId: string) => boolean;
}

interface HistoryState {
  history: string[];
  historyMeals: Meal[];
  loadHistory: () => Promise<void>;
  addToHistory: (mealId: string) => Promise<void>;
}

interface LoadingState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// ============================================================================
// Combined Store Type
// ============================================================================

type AppStore = UserState &
  ThemeState &
  MealState &
  IngredientState &
  FilteredMealsState &
  FavoritesState &
  HistoryState &
  LoadingState;

// ============================================================================
// Helper Functions
// ============================================================================

// Convert snake_case to camelCase
const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

// Convert database meal to app meal format
const convertMealFromDb = (dbMeal: any): Meal => {
  const meal: any = {};

  // Convert all keys to camelCase
  Object.keys(dbMeal).forEach((key) => {
    const camelKey = toCamelCase(key);
    meal[camelKey] = dbMeal[key];
  });

  // Parse ingredients if it's a string
  if (typeof meal.ingredients === 'string') {
    try {
      meal.ingredients = JSON.parse(meal.ingredients);
    } catch (e) {
      meal.ingredients = [];
    }
  }

  return meal as Meal;
};

// Convert app meal to database format
const convertMealToDb = (meal: Meal): any => {
  return {
    id: meal.id,
    name: meal.name,
    category: meal.category,
    area: meal.area,
    instructions: meal.instructions,
    thumbnail: meal.thumbnail,
    tags: meal.tags,
    youtube: meal.youtube,
    ingredients: JSON.stringify(meal.ingredients),
    source: meal.source,
    image_source: meal.imageSource,
    creative_commons_confirmed: meal.creativeCommonsConfirmed,
    date_modified: meal.dateModified,
  };
};

// Ingredient matcher utility
const ingredientMatcher = (
  mealIngredients: Array<{ ingredient: string; measure: string }>,
  searchIngredients: string[]
): boolean => {
  if (searchIngredients.length === 0) return true;

  const normalizedSearchIngredients = searchIngredients.map((ing) =>
    ing.toLowerCase().trim()
  );

  return normalizedSearchIngredients.every((searchIng) =>
    mealIngredients.some((mealIng) =>
      mealIng.ingredient.toLowerCase().includes(searchIng)
    )
  );
};

// System theme detection
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'light';
};

// ============================================================================
// Store Implementation
// ============================================================================

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ========================================================================
      // UserState
      // ========================================================================
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),

      // ========================================================================
      // ThemeState
      // ========================================================================
      theme: 'system',
      effectiveTheme: 'light',
      setTheme: (theme) => {
        const effectiveTheme =
          theme === 'system' ? getSystemTheme() : theme;

        // Update document class for dark mode
        if (typeof document !== 'undefined') {
          if (effectiveTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }

        set({ theme, effectiveTheme });
      },

      // ========================================================================
      // MealState
      // ========================================================================
      currentMeal: null,
      lastGeneratedMealId: null,
      setCurrentMeal: (meal) => set({ currentMeal: meal }),
      generateRandomMeal: async () => {
        set({ loading: true });
        try {
          // Fetch a random meal from Supabase
          const { data, error } = await supabase
            .from('meals')
            .select('*')
            .limit(1)
            .single();

          if (error) throw error;

          if (data) {
            const meal = convertMealFromDb(data);
            set({
              currentMeal: meal,
              lastGeneratedMealId: meal.id,
            });

            // Add to history
            await get().addToHistory(meal.id);
          }
        } catch (error) {
          console.error('Error generating random meal:', error);
        } finally {
          set({ loading: false });
        }
      },

      // ========================================================================
      // IngredientState
      // ========================================================================
      ingredients: [],
      addIngredient: (ingredient) => {
        const normalized = ingredient.trim();
        if (normalized && !get().ingredients.includes(normalized)) {
          set({ ingredients: [...get().ingredients, normalized] });
        }
      },
      removeIngredient: (ingredient) => {
        set({
          ingredients: get().ingredients.filter((ing) => ing !== ingredient),
        });
      },
      clearIngredients: () => set({ ingredients: [] }),

      // ========================================================================
      // FilteredMealsState
      // ========================================================================
      filteredMeals: [],
      setFilteredMeals: (meals) => set({ filteredMeals: meals }),
      filterByIngredients: async (ingredients) => {
        set({ loading: true });
        try {
          // Fetch all meals from Supabase
          const { data, error } = await supabase.from('meals').select('*');

          if (error) throw error;

          if (data) {
            const meals = data.map(convertMealFromDb);

            // Filter meals using ingredient matcher
            const filtered = meals.filter((meal) =>
              ingredientMatcher(meal.ingredients, ingredients)
            );

            set({ filteredMeals: filtered });
          }
        } catch (error) {
          console.error('Error filtering meals by ingredients:', error);
          set({ filteredMeals: [] });
        } finally {
          set({ loading: false });
        }
      },

      // ========================================================================
      // FavoritesState
      // ========================================================================
      favorites: [],
      favoriteMeals: [],
      loadFavorites: async () => {
        const { user } = get();
        if (!user) return;

        try {
          // Fetch favorite meal IDs
          const { data: favData, error: favError } = await supabase
            .from('favorites')
            .select('meal_id')
            .eq('user_id', user.id);

          if (favError) throw favError;

          const favoriteIds = favData?.map((fav) => fav.meal_id) || [];
          set({ favorites: favoriteIds });

          // Fetch favorite meals
          if (favoriteIds.length > 0) {
            const { data: mealsData, error: mealsError } = await supabase
              .from('meals')
              .select('*')
              .in('id', favoriteIds);

            if (mealsError) throw mealsError;

            const meals = mealsData?.map(convertMealFromDb) || [];
            set({ favoriteMeals: meals });
          } else {
            set({ favoriteMeals: [] });
          }
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      },
      addFavorite: async (mealId) => {
        const { user } = get();
        if (!user) return;

        try {
          // Insert favorite
          const { error } = await supabase.from('favorites').insert({
            user_id: user.id,
            meal_id: mealId,
          });

          if (error) throw error;

          // Reload favorites
          await get().loadFavorites();
        } catch (error) {
          console.error('Error adding favorite:', error);
        }
      },
      removeFavorite: async (mealId) => {
        const { user } = get();
        if (!user) return;

        try {
          // Delete favorite
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('meal_id', mealId);

          if (error) throw error;

          // Reload favorites
          await get().loadFavorites();
        } catch (error) {
          console.error('Error removing favorite:', error);
        }
      },
      isFavorite: (mealId) => {
        return get().favorites.includes(mealId);
      },

      // ========================================================================
      // HistoryState
      // ========================================================================
      history: [],
      historyMeals: [],
      loadHistory: async () => {
        const { user } = get();
        if (!user) return;

        try {
          // Fetch history meal IDs (ordered by created_at desc)
          const { data: historyData, error: historyError } = await supabase
            .from('history')
            .select('meal_id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (historyError) throw historyError;

          const historyIds = historyData?.map((hist) => hist.meal_id) || [];
          set({ history: historyIds });

          // Fetch history meals
          if (historyIds.length > 0) {
            const { data: mealsData, error: mealsError } = await supabase
              .from('meals')
              .select('*')
              .in('id', historyIds);

            if (mealsError) throw mealsError;

            // Maintain order from history
            const mealsMap = new Map(
              mealsData?.map((meal) => [meal.id, convertMealFromDb(meal)])
            );
            const orderedMeals = historyIds
              .map((id) => mealsMap.get(id))
              .filter((meal): meal is Meal => meal !== undefined);

            set({ historyMeals: orderedMeals });
          } else {
            set({ historyMeals: [] });
          }
        } catch (error) {
          console.error('Error loading history:', error);
        }
      },
      addToHistory: async (mealId) => {
        const { user } = get();
        if (!user) return;

        try {
          // Insert history entry
          const { error } = await supabase.from('history').insert({
            user_id: user.id,
            meal_id: mealId,
          });

          if (error) throw error;

          // Reload history
          await get().loadHistory();
        } catch (error) {
          console.error('Error adding to history:', error);
        }
      },

      // ========================================================================
      // LoadingState
      // ========================================================================
      loading: false,
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'mealgen-storage',
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);

// ============================================================================
// Theme Initialization
// ============================================================================

// Initialize theme on page load
if (typeof window !== 'undefined') {
  const store = useAppStore.getState();
  const { theme, setTheme } = store;

  // Set initial theme
  setTheme(theme);

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = (e: MediaQueryListEvent) => {
    const currentTheme = useAppStore.getState().theme;
    if (currentTheme === 'system') {
      useAppStore.getState().setTheme('system');
    }
  };

  // Use addEventListener for modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
  }
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',

      setTheme: (theme) => set({ theme }),

      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
      },

      initializeTheme: () => {
        const stored = localStorage.getItem('theme-storage');
        if (stored) {
          try {
            const { state } = JSON.parse(stored);
            set({ theme: state.theme });
          } catch {
            // Use system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            set({ theme: prefersDark ? 'dark' : 'light' });
          }
        } else {
          // Use system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          set({ theme: prefersDark ? 'dark' : 'light' });
        }
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface UIState {
  theme: Theme;
  isLoading: boolean;
  error: string | null;
  sidebarOpen: boolean;
  setTheme: (theme: Theme) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      isLoading: false,
      error: null,
      sidebarOpen: false,

      setTheme: (theme) => set({ theme }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

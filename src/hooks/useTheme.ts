import { useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';

export const useTheme = () => {
  const { theme, setTheme } = useAppStore();

  useEffect(() => {
    // Check OS preference on mount
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Only set if no theme is stored
    const stored = localStorage.getItem('meal-discovery-storage');
    if (!stored) {
      setTheme(prefersDark ? 'dark' : 'light');
    } else {
      // Apply stored theme
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  return { theme, setTheme };
};

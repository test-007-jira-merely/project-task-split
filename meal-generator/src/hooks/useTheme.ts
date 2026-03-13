import { useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useAppStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const stored = localStorage.getItem('mealgen-storage');

    if (!stored) {
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    }

    const handler = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem('mealgen-storage');
      if (!stored) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [setTheme]);

  return { theme, setTheme, toggleTheme };
}

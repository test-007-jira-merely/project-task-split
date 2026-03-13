import { useEffect } from 'react';
import { useAppStore } from '@stores/useAppStore';

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useAppStore();

  useEffect(() => {
    // Check OS preference on mount
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('mealgen-storage');

    if (!storedTheme) {
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    }

    const handleChange = (e: MediaQueryListEvent) => {
      const storedTheme = localStorage.getItem('mealgen-storage');
      if (!storedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return { theme, setTheme, toggleTheme };
}

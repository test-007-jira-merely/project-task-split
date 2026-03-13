import { useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';

export function useTheme() {
  const { theme, setTheme } = useAppStore();

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const systemTheme = mediaQuery.matches ? 'dark' : 'light';

    // Use stored theme or system preference
    const storedTheme = localStorage.getItem('theme');
    if (!storedTheme) {
      setTheme(systemTheme);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    // Listen for system theme changes
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme, setTheme]);

  return { theme };
}

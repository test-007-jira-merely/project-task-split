import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { useEffect } from 'react';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Check OS preference on mount
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const { setTheme } = useAppStore.getState();

    // Only set if no saved preference
    if (!localStorage.getItem('mealgen-storage') && prefersDark) {
      setTheme('dark');
    }
  }, []);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );
};

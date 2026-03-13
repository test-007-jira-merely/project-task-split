import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/useAppStore';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useAppStore();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="
        p-2 rounded-xl
        bg-gray-200 dark:bg-gray-700
        text-gray-700 dark:text-gray-300
        hover:bg-gray-300 dark:hover:bg-gray-600
        transition-colors
      "
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </motion.button>
  );
};

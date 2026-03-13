import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-neutral-200 dark:bg-neutral-700 transition-theme"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
      ) : (
        <Sun className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
      )}
    </motion.button>
  );
}

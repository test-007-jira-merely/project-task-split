import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/useAppStore';

export function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </motion.button>
  );
}

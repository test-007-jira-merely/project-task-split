import { motion } from 'framer-motion';
import { useMealStore } from '../store/useMealStore';

export default function ThemeToggle() {
  const { theme, setTheme } = useMealStore();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-8 bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-colors duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
        animate={{
          x: theme === 'light' ? 0 : 24
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
      >
        {theme === 'light' ? (
          <span className="text-sm">☀️</span>
        ) : (
          <span className="text-sm">🌙</span>
        )}
      </motion.div>
    </motion.button>
  );
}

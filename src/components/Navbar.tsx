import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  activeTab: 'home' | 'ingredients' | 'favorites';
  onTabChange: (tab: 'home' | 'ingredients' | 'favorites') => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-3xl">🍽️</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MealGen
            </h1>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1">
            {(['home', 'ingredients', 'favorites'] as const).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

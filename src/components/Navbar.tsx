import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

type Tab = 'home' | 'ingredients' | 'favorites';

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-lg border-b border-border-light dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-2xl">🍽️</div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-light to-purple-600 bg-clip-text text-transparent">
              MealGen
            </span>
          </motion.div>

          {/* Tabs */}
          <div className="flex items-center space-x-1 bg-surface-light dark:bg-surface-dark rounded-full p-1">
            {(['home', 'ingredients', 'favorites'] as Tab[]).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                  activeTab === tab
                    ? 'text-white'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary-light dark:bg-primary-dark rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </motion.button>
            ))}
          </div>

          {/* Theme Toggle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ThemeToggle />
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

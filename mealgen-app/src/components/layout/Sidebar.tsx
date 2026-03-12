import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Heart, History } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/ingredients', label: 'Ingredients', icon: Search },
    ...(isAuthenticated ? [
      { to: '/favorites', label: 'Favorites', icon: Heart },
      { to: '/history', label: 'History', icon: History },
    ] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-4rem)] sticky top-16">
      <nav className="p-4 space-y-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className="relative block"
            >
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
              {active && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-teal-600 dark:bg-teal-500 rounded-r"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

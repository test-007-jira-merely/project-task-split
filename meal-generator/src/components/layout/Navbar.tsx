import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Clock, Shield } from 'lucide-react';
import { ThemeToggle } from '../../features/theme/ThemeToggle';
import { UserMenu } from './UserMenu';
import { useAppStore } from '../../stores/useAppStore';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const location = useLocation();
  const user = useAppStore((state) => state.user);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/ingredients', label: 'Ingredients', icon: Search },
    { path: '/favorites', label: 'Favorites', icon: Heart, protected: true },
    { path: '/history', label: 'History', icon: Clock, protected: true },
  ];

  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];
  const isAdmin = user && adminEmails.includes(user.email);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              MealGen
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              if (item.protected && !user) return null;
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
            {isAdmin && (
              <Link to="/admin">
                <motion.div
                  className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors ${
                    location.pathname === '/admin'
                      ? 'bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Admin</span>
                </motion.div>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

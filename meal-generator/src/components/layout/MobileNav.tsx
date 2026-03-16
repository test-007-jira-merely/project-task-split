import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Clock, Shield } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { motion } from 'framer-motion';

export const MobileNav = () => {
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          if (item.protected && !user) return null;
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path} className="flex-1">
              <motion.div
                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
        {isAdmin && (
          <Link to="/admin" className="flex-1">
            <motion.div
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-colors ${
                location.pathname === '/admin'
                  ? 'bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <Shield className="w-6 h-6" />
              <span className="text-xs font-medium">Admin</span>
            </motion.div>
          </Link>
        )}
      </div>
    </nav>
  );
};

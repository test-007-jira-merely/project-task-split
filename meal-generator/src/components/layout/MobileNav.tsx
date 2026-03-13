import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, History } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function MobileNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/ingredients', label: 'Search', icon: Search },
    { path: '/favorites', label: 'Favorites', icon: Heart, authRequired: true },
    { path: '/history', label: 'History', icon: History, authRequired: true },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-gray-200 dark:border-gray-800 z-30">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          if (item.authRequired && !isAuthenticated) return null;
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

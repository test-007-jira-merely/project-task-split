import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, History, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function Sidebar() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/ingredients', label: 'Ingredients', icon: Search },
    { path: '/favorites', label: 'Favorites', icon: Heart, authRequired: true },
    { path: '/history', label: 'History', icon: History, authRequired: true },
    { path: '/admin', label: 'Admin', icon: Shield, authRequired: true },
  ];

  return (
    <aside className="hidden lg:block w-64 glass border-r border-gray-200 dark:border-gray-800 min-h-screen p-4">
      <div className="space-y-2">
        {navItems.map((item) => {
          if (item.authRequired && !isAuthenticated) return null;
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

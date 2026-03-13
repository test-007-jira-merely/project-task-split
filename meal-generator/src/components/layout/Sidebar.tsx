import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, History } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/ingredients', icon: Search, label: 'Ingredients' },
    { path: '/favorites', icon: Heart, label: 'Favorites' },
    { path: '/history', icon: History, label: 'History' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="hidden lg:block w-64 glass-card border-r border-gray-200/50 dark:border-gray-700/50 h-[calc(100vh-4rem)] sticky top-16">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-2xl
              font-medium transition-all
              ${isActive(item.path)
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

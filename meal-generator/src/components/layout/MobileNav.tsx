import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, History } from 'lucide-react';

export const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/ingredients', icon: Search, label: 'Find' },
    { path: '/favorites', icon: Heart, label: 'Saved' },
    { path: '/history', icon: History, label: 'History' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 glass-card border-t border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex flex-col items-center gap-1 px-3 py-2 rounded-xl
              transition-all min-w-[4rem]
              ${isActive(item.path)
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'text-gray-600 dark:text-gray-400'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

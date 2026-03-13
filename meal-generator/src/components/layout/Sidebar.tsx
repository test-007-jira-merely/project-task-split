import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, History } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Ingredients', href: '/ingredients', icon: Search },
    { name: 'Favorites', href: '/favorites', icon: Heart },
    { name: 'History', href: '/history', icon: History },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 transition-theme">
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-theme ${
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

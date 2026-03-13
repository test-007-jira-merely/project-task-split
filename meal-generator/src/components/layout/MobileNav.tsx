import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, History } from 'lucide-react';

export function MobileNav() {
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Ingredients', href: '/ingredients', icon: Search },
    { name: 'Favorites', href: '/favorites', icon: Heart },
    { name: 'History', href: '/history', icon: History },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 transition-theme">
      <div className="flex items-center justify-around px-4 py-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-theme ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Icon className="w-6 h-6" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

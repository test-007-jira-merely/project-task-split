import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, History } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';

export const MobileNav = () => {
  const { user } = useAppStore();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/ingredients', icon: Search, label: 'Search' },
    ...(user ? [
      { to: '/favorites', icon: Heart, label: 'Favorites' },
      { to: '/history', icon: History, label: 'History' },
    ] : []),
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-30">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`
            }
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

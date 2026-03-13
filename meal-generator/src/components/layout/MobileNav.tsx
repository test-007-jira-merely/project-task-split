import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, Clock } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

export function MobileNav() {
  const user = useAppStore((state) => state.user);

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/ingredients', icon: Search, label: 'Search' },
    { to: '/favorites', icon: Heart, label: 'Favorites', authRequired: true },
    { to: '/history', icon: Clock, label: 'History', authRequired: true },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (item.authRequired && !user) return false;
    return true;
  });

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-30">
      <div className="flex items-center justify-around">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center py-3 px-4 flex-1 ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

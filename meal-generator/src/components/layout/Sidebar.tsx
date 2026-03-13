import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, History, Shield } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';

export const Sidebar = () => {
  const { user } = useAppStore();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/ingredients', icon: Search, label: 'Ingredients' },
    ...(user ? [
      { to: '/favorites', icon: Heart, label: 'Favorites' },
      { to: '/history', icon: History, label: 'History' },
    ] : []),
    ...(user?.is_admin ? [{ to: '/admin', icon: Shield, label: 'Admin' }] : []),
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-4rem)] sticky top-16">
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

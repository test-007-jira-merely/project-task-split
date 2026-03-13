import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, Heart, Clock, Shield } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

export function MobileNav() {
  const location = useLocation();
  const { user } = useAppStore();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Ingredients', href: '/ingredients', icon: Layers },
    { name: 'Favorites', href: '/favorites', icon: Heart },
    { name: 'History', href: '/history', icon: Clock },
  ];

  if (user?.role === 'admin') {
    navigation.push({ name: 'Admin', href: '/admin', icon: Shield });
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-gray-200 dark:border-gray-800 z-30">
      <div className="flex items-center justify-around h-16">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

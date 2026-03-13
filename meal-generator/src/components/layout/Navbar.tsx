import { Link, useLocation } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import { useAuth } from '@hooks/useAuth';
import { Button } from '@components/ui/Button';

export function Navbar() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Ingredients', href: '/ingredients' },
    { name: 'Favorites', href: '/favorites' },
    { name: 'History', href: '/history' },
  ];

  return (
    <nav className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-800 transition-theme">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary-500">
              <ChefHat className="w-8 h-8" />
              <span className="hidden sm:inline">MealGen</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-theme ${
                    location.pathname === item.href
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link to="/login">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, Heart, History, Shield } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/Button';
import { isAdmin } from '@/services/supabase';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/ingredients', label: 'Ingredients', icon: Search },
    { to: '/favorites', label: 'Favorites', icon: Heart },
    { to: '/history', label: 'History', icon: History },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/auth/login');
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg" />
            <span className="text-xl font-bold">MealGen</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 text-sm font-medium hover:text-primary-600 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
            {user && isAdmin(user.email) && (
              <Link
                to="/admin"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary-600 transition-colors"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <UserMenu user={user} onLogout={handleLogout} />
            ) : (
              <Button size="sm" onClick={() => navigate('/auth/login')}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 z-30">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-1 text-xs"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

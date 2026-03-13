import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, History, User, LogOut, Settings, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { ElementType } from 'react';

export function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              MealGen
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" icon={Home} label="Home" active={isActive('/')} />
            <NavLink to="/ingredients" icon={Search} label="Ingredients" active={isActive('/ingredients')} />
            {user && (
              <>
                <NavLink to="/favorites" icon={Heart} label="Favorites" active={isActive('/favorites')} />
                <NavLink to="/history" icon={History} label="History" active={isActive('/history')} />
                {user.isAdmin && (
                  <NavLink to="/admin" icon={Settings} label="Admin" active={isActive('/admin')} />
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">
                  {user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth/login">
                <Button size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  to: string;
  icon: ElementType;
  label: string;
  active: boolean;
}

function NavLink({ to, icon: Icon, label, active }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
        active
          ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

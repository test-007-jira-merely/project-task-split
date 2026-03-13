import { Link } from 'react-router-dom';
import { Menu, User, LogOut } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { authService } from '@/services/authService';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const user = useAppStore((state) => state.user);

  const handleLogout = async () => {
    await authService.signOut();
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center ml-2 lg:ml-0">
              <span className="text-2xl font-bold text-primary-600">MealGen</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.email}
                  </p>
                  {user.is_admin && (
                    <p className="text-xs text-primary-600">Admin</p>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <LogOut className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </motion.button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

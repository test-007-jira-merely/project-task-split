import { Link } from 'react-router-dom';
import { Home, Search, Heart, History, Moon, Sun, User, LogOut, LogIn } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { authService } from '../../services/supabase';
import { motion } from 'framer-motion';

export function Navbar() {
  const user = useAppStore(state => state.user);
  const theme = useAppStore(state => state.theme);
  const toggleTheme = useAppStore(state => state.toggleTheme);
  const setUser = useAppStore(state => state.setUser);

  const handleLogout = async () => {
    await authService.signOut();
    setUser(null);
  };

  return (
    <nav className="sticky top-0 z-30 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent"
            >
              MealGen
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={<Home className="w-5 h-5" />} label="Home" />
            <NavLink to="/ingredients" icon={<Search className="w-5 h-5" />} label="Ingredients" />
            {user && (
              <>
                <NavLink to="/favorites" icon={<Heart className="w-5 h-5" />} label="Favorites" />
                <NavLink to="/history" icon={<History className="w-5 h-5" />} label="History" />
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-dark-800 rounded-lg">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-700 px-4 py-2 z-30">
        <div className="flex items-center justify-around">
          <MobileNavLink to="/" icon={<Home className="w-6 h-6" />} label="Home" />
          <MobileNavLink to="/ingredients" icon={<Search className="w-6 h-6" />} label="Search" />
          {user && (
            <>
              <MobileNavLink to="/favorites" icon={<Heart className="w-6 h-6" />} label="Favorites" />
              <MobileNavLink to="/history" icon={<History className="w-6 h-6" />} label="History" />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300 transition-colors"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function MobileNavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  );
}

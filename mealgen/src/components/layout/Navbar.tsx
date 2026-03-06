import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  HomeIcon,
  BeakerIcon,
  HeartIcon,
  ClockIcon,
  Cog6ToothIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import type { NavbarProps } from '@/types/components';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import { Sidebar } from './Sidebar';
import { useAppStore } from '@/stores/useAppStore';
import { authService } from '@/services/authService';

export function Navbar({ onToggleTheme, theme }: NavbarProps) {
  const location = useLocation();
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/ingredients', label: 'Ingredients', icon: BeakerIcon },
    { to: '/favorites', label: 'Favorites', icon: HeartIcon },
    { to: '/history', label: 'History', icon: ClockIcon },
  ];

  if (user?.is_admin) {
    navLinks.push({ to: '/admin', label: 'Admin', icon: Cog6ToothIcon });
  }

  return (
    <>
      <nav className="glass-card sticky top-0 z-30 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                MealGen
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {user &&
                navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  );
                })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              {user ? (
                <UserMenu user={user} onLogout={handleLogout} />
              ) : (
                <Link
                  to="/auth/login"
                  className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              {user && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

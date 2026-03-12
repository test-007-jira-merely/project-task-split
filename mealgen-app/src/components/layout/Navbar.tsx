import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import { useAuth } from '@/hooks/useAuth';
import Button from '../ui/Button';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/ingredients', label: 'Ingredients' },
    ...(isAuthenticated ? [
      { to: '/favorites', label: 'Favorites' },
      { to: '/history', label: 'History' },
    ] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <ChefHat className="w-8 h-8 text-teal-600 dark:text-teal-500 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              MealGen
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500 transition-colors"
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 dark:bg-teal-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
        >
          <div className="px-4 py-3 space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 transition-colors text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}

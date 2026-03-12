import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Heart, History, ChefHat } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Discover', icon: Home },
    { path: '/favorites', label: 'Favorites', icon: Heart },
    { path: '/history', label: 'History', icon: History },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              MealDiscovery
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-surface"
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary-600' : 'text-text-secondary'}`} />
                    <span className={isActive ? 'text-primary-600' : 'text-text-secondary'}>
                      {link.label}
                    </span>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-600"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <div className="ml-4 pl-4 border-l border-border">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

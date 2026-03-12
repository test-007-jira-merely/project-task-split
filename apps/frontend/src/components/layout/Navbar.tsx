import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { ThemeToggle } from '../theme/ThemeToggle';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/explore', label: 'Explore' },
  { path: '/favorites', label: 'Favorites' },
  { path: '/history', label: 'History' },
];

export function Navbar() {
  const location = useLocation();

  return (
    <motion.nav
      className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <ChefHat className="w-8 h-8 text-primary" />
            </motion.div>
            <span className="text-xl font-bold gradient-text">MealMaster</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 text-sm font-medium transition-colors"
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-primary/10 rounded-lg"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className={isActive ? 'text-primary relative z-10' : 'text-muted relative z-10 hover:text-foreground'}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}

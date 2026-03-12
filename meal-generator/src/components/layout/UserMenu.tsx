import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Shield } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAppStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return (
      <button
        onClick={() => navigate('/auth/login')}
        className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      >
        <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
          {user.email[0].toUpperCase()}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.email}</p>
              {user.isAdmin && (
                <span className="inline-flex items-center gap-1 mt-1 text-xs text-primary-600 dark:text-primary-400">
                  <Shield className="h-3 w-3" />
                  Admin
                </span>
              )}
            </div>
            <div className="py-2">
              {user.isAdmin && (
                <button
                  onClick={() => {
                    navigate('/admin');
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

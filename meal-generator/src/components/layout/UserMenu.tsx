import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, isAdmin, signOut } = useAuth();
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
    setIsOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 p-2 rounded-xl
          bg-gray-200 dark:bg-gray-700
          hover:bg-gray-300 dark:hover:bg-gray-600
          transition-colors
        "
      >
        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="
              absolute right-0 mt-2 w-64
              bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              rounded-2xl shadow-xl
              overflow-hidden
              z-50
            "
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {isAdmin ? 'Administrator' : 'User'}
              </p>
            </div>

            <div className="p-2">
              {isAdmin && (
                <button
                  onClick={() => {
                    navigate('/admin');
                    setIsOpen(false);
                  }}
                  className="
                    w-full flex items-center gap-3 px-3 py-2 rounded-xl
                    text-gray-700 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    transition-colors
                  "
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Admin Panel</span>
                </button>
              )}

              <button
                onClick={handleSignOut}
                className="
                  w-full flex items-center gap-3 px-3 py-2 rounded-xl
                  text-red-600 dark:text-red-400
                  hover:bg-red-50 dark:hover:bg-red-900/20
                  transition-colors
                "
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

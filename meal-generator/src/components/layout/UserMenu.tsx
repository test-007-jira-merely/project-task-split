import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import { authService } from '../../services/authService';

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.signOut();
    setUser(null);
    navigate('/');
    setIsOpen(false);
  };

  if (!user) {
    return (
      <Link to="/login">
        <motion.button
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogIn className="w-5 h-5" />
          <span className="hidden sm:inline">Login</span>
        </motion.button>
      </Link>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium truncate">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

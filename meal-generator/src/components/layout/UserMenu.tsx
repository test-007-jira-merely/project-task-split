import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { authService } from '@/services/authService';

export function UserMenu() {
  const { user, setUser } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link to="/login" className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:inline">Login</span>
        </Link>
        <Link to="/signup" className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors">
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Up</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
          {user.email[0].toUpperCase()}
        </div>
        <span className="hidden sm:inline">{user.email}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-56 glass-card rounded-2xl shadow-lg z-20 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as</p>
                <p className="font-medium truncate">{user.email}</p>
                {user.role === 'admin' && (
                  <span className="inline-block mt-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-lg">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

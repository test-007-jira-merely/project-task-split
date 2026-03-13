import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function UserMenu() {
  const { user, isAdmin, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-xl bg-neutral-200 dark:bg-neutral-700 transition-theme"
      >
        <User className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden z-20"
            >
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{user.email}</p>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 mt-1 text-xs text-primary-500">
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>
              {isAdmin && (
                <button
                  onClick={() => {
                    navigate('/admin');
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-theme flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-theme flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

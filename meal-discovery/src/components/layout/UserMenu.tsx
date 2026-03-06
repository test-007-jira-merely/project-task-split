import { useState } from 'react';
import { UserMenuProps } from '@/types/components';
import { LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const UserMenu = ({ user, onLogout }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
          {user.email[0].toUpperCase()}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-56 bg-card rounded-xl shadow-lg border border-border py-2 z-50"
          >
            <div className="px-4 py-2 border-b border-border">
              <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as</p>
              <p className="text-sm font-medium truncate">{user.email}</p>
            </div>
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-red-600"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

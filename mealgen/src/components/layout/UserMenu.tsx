import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import type { UserMenuProps } from '@/types/components';

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <UserCircleIcon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              className="absolute right-0 mt-2 w-64 glass-card p-2 z-20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.email}
                </p>
                {user.is_admin && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded">
                    Admin
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Sign Out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

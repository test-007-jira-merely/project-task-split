import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      {icon && <div className="text-neutral-400 dark:text-neutral-600 mb-4">{icon}</div>}
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">{title}</h3>
      {description && <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">{description}</p>}
      {action && <div>{action}</div>}
    </motion.div>
  );
}

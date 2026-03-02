import { motion } from 'framer-motion';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({ title, description, icon = '🍽️', action }: EmptyStateProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
        {title}
      </h3>
      <p className="text-text-secondary-light dark:text-text-secondary-dark max-w-md mb-6">
        {description}
      </p>
      {action && (
        <motion.button
          onClick={action.onClick}
          className="px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-2xl font-medium hover:shadow-lg transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  glass?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Card({ className = '', glass = false, children }: CardProps) {
  const baseStyles = 'rounded-2xl p-6';
  const glassStyles = glass
    ? 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-glass dark:shadow-glass-dark'
    : 'bg-white dark:bg-gray-800 shadow-lg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${baseStyles} ${glassStyles} ${className}`}
    >
      {children}
    </motion.div>
  );
}

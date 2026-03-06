import { motion } from 'framer-motion';
import type { CardProps } from '@/types/components';

export function Card({
  children,
  className = '',
  onClick,
  hover = true,
}: CardProps) {
  const baseClasses = 'glass-card p-6';
  const hoverClasses = hover
    ? 'transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl cursor-pointer'
    : '';

  if (onClick) {
    return (
      <motion.div
        className={`${baseClasses} ${hoverClasses} ${className}`}
        onClick={onClick}
        whileHover={{ y: hover ? -4 : 0 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
}

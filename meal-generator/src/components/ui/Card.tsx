import { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
}

export const Card = ({ hover = false, glass = false, className = '', children, ...props }: CardProps) => {
  const baseStyles = 'rounded-2xl p-6';
  const glassStyles = glass ? 'glass-card' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg';

  const Component = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { scale: 1.02, y: -4 },
    transition: { duration: 0.2 },
  } : {};

  return (
    <Component
      className={`${baseStyles} ${glassStyles} ${className}`}
      {...(hover ? motionProps : {})}
      {...props}
    >
      {children}
    </Component>
  );
};

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover ? {
    whileHover: { scale: 1.02, y: -4 },
    transition: { duration: 0.2 },
  } : {};

  return (
    <Component
      className={`glass-card rounded-3xl p-6 ${className}`}
      {...hoverProps}
    >
      {children}
    </Component>
  );
}

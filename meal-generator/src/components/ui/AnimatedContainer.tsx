import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedContainer = ({ children, className = '', delay = 0 }: AnimatedContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

interface AnimatedContainerProps {
  children: ReactNode;
  animation?: 'fade' | 'slide' | 'scale' | 'none';
  delay?: number;
  duration?: number;
}

const variants: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slide: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
};

export function AnimatedContainer({ 
  children, 
  animation = 'fade', 
  delay = 0, 
  duration = 0.5 
}: AnimatedContainerProps) {
  if (animation === 'none') {
    return <>{children}</>;
  }

  return (
    <motion.div
      variants={variants[animation]}
      initial="hidden"
      animate="visible"
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}

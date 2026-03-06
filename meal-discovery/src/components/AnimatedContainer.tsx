import { AnimatedContainerProps } from '@/types/components';
import { motion } from 'framer-motion';

export const AnimatedContainer = ({
  children,
  className = '',
  animation = 'fade',
  delay = 0
}: AnimatedContainerProps) => {
  const animations = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
  };

  return (
    <motion.div
      className={className}
      initial={animations[animation].initial}
      animate={animations[animation].animate}
      exit={animations[animation].exit}
      transition={{ duration: 0.3, delay }}
    >
      {children}
    </motion.div>
  );
};

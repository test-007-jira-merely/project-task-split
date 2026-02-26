import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onGenerateMeal: () => void;
  isLoading?: boolean;
}

export function HeroSection({ onGenerateMeal, isLoading }: HeroSectionProps) {
  return (
    <section className="relative text-center py-16 md:py-24 space-y-8">
      {/* Animated gradient title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="gradient-text">
          Discover Your Next
          <br />
          Favorite Meal
        </h1>
      </motion.div>

      {/* Typewriter subtitle */}
      <motion.p
        className="text-xl md:text-2xl text-muted max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Random meal inspiration at your fingertips. Filter by ingredients, save favorites, and explore endless possibilities.
      </motion.p>

      {/* Floating generate button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 300 }}
      >
        <motion.button
          className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4 shadow-lg"
          onClick={onGenerateMeal}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isLoading ? { } : { y: [0, -8, 0] }}
          transition={isLoading ? {} : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles className="w-5 h-5" />
          {isLoading ? 'Generating...' : 'Generate Random Meal'}
        </motion.button>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>
    </section>
  );
}

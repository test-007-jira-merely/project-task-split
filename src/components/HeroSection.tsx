import { motion } from 'framer-motion';
import { useMealStore } from '../store/useMealStore';

export default function HeroSection() {
  const { generateRandomMeal } = useMealStore();

  return (
    <div className="text-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Discover Your Next Meal
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Let us help you find the perfect recipe. Generate random meal ideas or filter by your available ingredients.
        </p>
        <motion.button
          onClick={generateRandomMeal}
          className="btn-primary text-lg px-8 py-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🎲 Generate Random Meal
        </motion.button>
      </motion.div>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { MealCard } from '@components/meal/MealCard';
import { MealDetailsModal } from '@components/meal/MealDetailsModal';
import { useMealGenerator } from '@features/meal-generator/useMealGenerator';
import { EmptyState } from '@components/ui/EmptyState';
import type { Meal } from '@types/meal';

export function Home() {
  const { currentMeal, generateRandomMeal, isGenerating } = useMealGenerator();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Discover Your Next
          <span className="text-primary-500"> Delicious Meal</span>
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
          Let us help you find the perfect recipe for any occasion
        </p>
        <Button size="lg" onClick={generateRandomMeal} isLoading={isGenerating}>
          <Shuffle className="w-5 h-5 mr-2" />
          Generate Random Meal
        </Button>
      </motion.div>

      {currentMeal ? (
        <motion.div
          key={currentMeal.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <MealCard meal={currentMeal} onClick={() => setSelectedMeal(currentMeal)} />
        </motion.div>
      ) : (
        <EmptyState
          title="No meal generated yet"
          description="Click the button above to generate a random meal"
        />
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />
    </div>
  );
}

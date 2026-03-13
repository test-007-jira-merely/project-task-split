import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { useMealGenerator } from '@/features/meal-generator/useMealGenerator';
import { useFavorites } from '@/features/favorites/useFavorites';
import { Meal } from '@/types/meal';
import { useAppStore } from '@/stores/useAppStore';

export const Home = () => {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const { currentMeal } = useAppStore();
  const { isLoading, isGenerating, generateMeal } = useMealGenerator();
  const { isFavorited, toggleFavorite } = useFavorites();

  const handleGenerate = async () => {
    await generateMeal();
  };

  return (
    <div className="space-y-8">
      <AnimatedContainer>
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 mb-6"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Your Next Meal
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Generate random meals from our collection or find recipes based on your available ingredients
          </p>

          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={isLoading || isGenerating}
            isLoading={isGenerating}
            className="min-w-[200px]"
          >
            {isGenerating ? (
              'Generating...'
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Generate Meal
              </>
            )}
          </Button>
        </div>
      </AnimatedContainer>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Skeleton height="400px" />
          </motion.div>
        ) : currentMeal ? (
          <motion.div
            key={currentMeal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <MealCard
              meal={currentMeal}
              onView={() => setSelectedMeal(currentMeal)}
              onFavorite={() => toggleFavorite(currentMeal.id)}
              isFavorited={isFavorited(currentMeal.id)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState
              icon={Sparkles}
              title="Ready to discover?"
              description="Click the button above to generate a random meal from our collection"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onFavorite={selectedMeal ? () => toggleFavorite(selectedMeal.id) : undefined}
        isFavorited={selectedMeal ? isFavorited(selectedMeal.id) : false}
      />
    </div>
  );
};

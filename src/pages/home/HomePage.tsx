import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button, AnimatedContainer } from '@/components/ui';
import { MealCard, MealDetailsModal } from '@/components/meal';
import { useMealGenerator } from '@/features/meal-generator/useMealGenerator';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useAppStore } from '@/stores/useAppStore';
import { Meal } from '@/types';

const HomePage: React.FC = () => {
  const { currentMeal, generateMeal, isGenerating } = useMealGenerator();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAppStore();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <h1 className="text-5xl font-bold text-foreground mb-4">
          Discover Your Next Meal
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Generate random meals, find recipes by ingredients, and save your favorites
        </p>
        <Button
          size="lg"
          variant="primary"
          onClick={generateMeal}
          loading={isGenerating}
          disabled={isGenerating}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Meal
        </Button>
      </motion.div>

      {currentMeal && (
        <AnimatedContainer animation="scale" className="max-w-2xl mx-auto">
          <MealCard
            meal={currentMeal}
            onView={setSelectedMeal}
            onFavorite={user ? toggleFavorite : undefined}
            isFavorite={user ? isFavorite(currentMeal.id) : false}
          />
        </AnimatedContainer>
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onFavorite={user ? toggleFavorite : undefined}
        isFavorite={selectedMeal ? isFavorite(selectedMeal.id) : false}
      />
    </div>
  );
};

export default HomePage;

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DishCard } from '@/components/DishCard';
import { IngredientEngine } from '@/components/IngredientEngine';
import { MatchResultCard } from '@/components/MatchResultCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { useRandomDish } from '@/hooks/useDishes';
import { useAppStore } from '@/stores/useAppStore';

export function HomePage() {
  const currentDish = useAppStore((state) => state.currentDish);
  const matchResults = useAppStore((state) => state.matchResults);
  const randomDishMutation = useRandomDish();

  const handleGenerateMeal = () => {
    randomDishMutation.mutate();
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 py-12"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-gradient"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          Discover Your Next Meal
        </motion.h1>
        <motion.p
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          AI-powered meal discovery with intelligent ingredient matching
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            size="lg"
            onClick={handleGenerateMeal}
            isLoading={randomDishMutation.isPending}
            className="text-lg"
          >
            <Sparkles className="h-5 w-5" />
            Generate Random Meal
          </Button>
        </motion.div>
      </motion.section>

      {/* Current Dish */}
      {randomDishMutation.isPending && (
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-[600px] rounded-xl" />
        </div>
      )}

      {currentDish && !randomDishMutation.isPending && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto"
        >
          <DishCard dish={currentDish} />
        </motion.section>
      )}

      {/* Ingredient Engine */}
      <section className="max-w-4xl mx-auto">
        <IngredientEngine />
      </section>

      {/* Match Results */}
      {matchResults.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Best Matches</h2>
            <p className="text-muted-foreground">
              Found {matchResults.length} recipes based on your ingredients
            </p>
          </div>

          <div className="grid gap-8 max-w-4xl mx-auto">
            {matchResults.map((result, index) => (
              <MatchResultCard key={result.dish.id} result={result} index={index} />
            ))}
          </div>
        </motion.section>
      )}

      {/* Empty State */}
      {!currentDish && !randomDishMutation.isPending && matchResults.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-2xl font-semibold mb-2">Ready to Cook?</h3>
          <p className="text-muted-foreground mb-6">
            Generate a random meal or search by ingredients to get started
          </p>
        </motion.div>
      )}
    </div>
  );
}

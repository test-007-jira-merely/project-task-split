import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { DishCard } from '@/components/dish/DishCard';
import { IngredientEngine } from '@/components/ingredient/IngredientEngine';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MatchIndicator } from '@/components/ingredient/MatchIndicator';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { useDishStore } from '@/stores/dish-store';
import { useIngredientStore } from '@/stores/ingredient-store';
import { useRandomDish } from '@/hooks/useRandomDish';
import { FiRefreshCw } from 'react-icons/fi';
import { useMemo } from 'react';
import { apiClient } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

export function HomePage() {
  const { currentDish } = useDishStore();
  const { matchResults } = useIngredientStore();
  const randomDishMutation = useRandomDish();

  const handleGenerateMeal = () => {
    randomDishMutation.mutate({});
  };

  // Fetch dishes for match results
  const dishIds = useMemo(() => matchResults.map(m => m.dishId), [matchResults]);
  const dishQueries = useQuery({
    queryKey: ['dishes', dishIds],
    queryFn: async () => {
      if (dishIds.length === 0) return [];
      const dishes = await Promise.all(
        dishIds.slice(0, 10).map(id => apiClient.getDishById(id))
      );
      return dishes.map((d: any) => d.data);
    },
    enabled: dishIds.length > 0,
  });

  const matchedDishes = useMemo(() => {
    if (!dishQueries.data) return [];
    return matchResults
      .map(match => ({
        dish: dishQueries.data.find((d: any) => d.id === match.dishId),
        match,
      }))
      .filter(item => item.dish);
  }, [matchResults, dishQueries.data]);

  return (
    <AppLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              Discover Your Next Meal
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Generate random dishes or find recipes that match your ingredients
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Button
              onClick={handleGenerateMeal}
              variant="primary"
              size="lg"
              disabled={randomDishMutation.isPending}
              className="text-lg px-8 py-4 shadow-lg shadow-primary-500/30"
            >
              {randomDishMutation.isPending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <FiRefreshCw className="w-6 h-6 mr-2" />
                  </motion.div>
                  Generating...
                </>
              ) : (
                <>
                  <FiRefreshCw className="w-6 h-6 mr-2" />
                  Generate Random Meal
                </>
              )}
            </Button>
          </motion.div>
        </section>

        {/* Current Dish Display */}
        <section>
          {randomDishMutation.isPending ? (
            <LoadingSkeleton variant="card" count={1} />
          ) : currentDish ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <DishCard dish={currentDish} variant="detailed" />
            </motion.div>
          ) : (
            <EmptyState
              title="No dish selected"
              description="Click the button above to generate a random meal suggestion"
              icon="🍽️"
            />
          )}
        </section>

        {/* Ingredient Matching Section */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Find Dishes by Ingredients
            </h2>
            <p className="text-muted-foreground">
              Enter the ingredients you have and we'll find matching recipes
            </p>
          </div>

          <Card className="p-6">
            <IngredientEngine />
          </Card>

          {/* Match Results */}
          {matchedDishes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">
                Found {matchedDishes.length} Matching Dishes
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedDishes.map(({ dish, match }) => (
                  <div key={dish!.id} className="space-y-3">
                    <DishCard dish={dish!} />
                    <Card className="p-4">
                      <MatchIndicator matchScore={match} variant="detailed" />
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

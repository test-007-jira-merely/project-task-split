import { HeroSection } from '@/components/hero/HeroSection';
import { DishCard } from '@/components/dish/DishCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';
import { useRandomDish } from '@/hooks/useRandomDish';
import { useDishStore } from '@/stores/useDishStore';

export function HomePage() {
  const { mutate: generateDish, isPending } = useRandomDish();
  const { currentDish, dishHistory, getRecentDishes } = useDishStore();

  const handleGenerate = () => {
    const excludeIds = dishHistory.slice(0, 5).map((d) => d.id);
    generateDish(excludeIds);
  };

  const recentDishes = getRecentDishes(8);

  return (
    <div className="space-y-12">
      <HeroSection onGenerateMeal={handleGenerate} isLoading={isPending} />

      {/* Current Dish */}
      {currentDish && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold">Your Meal</h2>
          <div className="max-w-2xl mx-auto">
            <DishCard dish={currentDish} />
          </div>
        </motion.section>
      )}

      {/* Recent Dishes */}
      {recentDishes.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Recently Generated</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentDishes.map((dish, index) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DishCard dish={dish} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {!currentDish && recentDishes.length === 0 && (
        <EmptyState
          icon={ChefHat}
          title="Ready to discover?"
          description="Click the button above to generate your first random meal idea!"
          action={{
            label: 'Generate Meal',
            onClick: handleGenerate,
          }}
        />
      )}
    </div>
  );
}

import { IngredientEngine } from '@/components/ingredients/IngredientEngine';
import { DishCard } from '@/components/dish/DishCard';
import { MatchIndicator } from '@/components/matching/MatchIndicator';
import { EmptyState } from '@/components/ui/EmptyState';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useMatchingStore } from '@/stores/useMatchingStore';
import { useMatchingDishes } from '@/hooks/useMatchingDishes';

export function ExplorePage() {
  const {
    userIngredients,
    matches,
    addIngredient,
    removeIngredient,
    clearIngredients,
  } = useMatchingStore();

  const { mutate: searchDishes, isPending } = useMatchingDishes();

  const handleSearch = () => {
    searchDishes(userIngredients);
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="gradient-text">Explore by Ingredients</h1>
        <p className="text-xl text-muted max-w-2xl mx-auto">
          Tell us what you have, and we'll find perfect recipes with intelligent matching
        </p>
      </div>

      <IngredientEngine
        ingredients={userIngredients}
        onAdd={addIngredient}
        onRemove={removeIngredient}
        onSearch={handleSearch}
        isSearching={isPending}
      />

      {/* Match Results */}
      {matches.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">
              Found {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
            </h2>
            <button
              onClick={clearIngredients}
              className="text-muted hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match, index) => (
              <motion.div
                key={match.dishId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-3"
              >
                <DishCard dish={match.dish} />
                <MatchIndicator match={match} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {userIngredients.length === 0 && (
        <EmptyState
          icon={Search}
          title="Start Exploring"
          description="Add ingredients you have on hand to discover delicious recipes"
        />
      )}
    </div>
  );
}

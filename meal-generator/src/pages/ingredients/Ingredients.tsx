import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { IngredientInput } from '@/components/ingredients/IngredientInput';
import { IngredientTag } from '@/components/ingredients/IngredientTag';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { useAppStore } from '@/stores/useAppStore';
import { useIngredientFilter } from '@/features/ingredient-filter/useIngredientFilter';
import { useFavorites } from '@/features/favorites/useFavorites';
import { MealMatch, MealCategory } from '@/types/meal';

export const Ingredients = () => {
  const [selectedMeal, setSelectedMeal] = useState<MealMatch | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MealCategory | undefined>();
  const [sortBy, setSortBy] = useState<'match' | 'random' | 'category' | 'name'>('match');

  const { ingredients, addIngredient, removeIngredient, clearIngredients } = useAppStore();
  const { filteredMeals, allIngredients, isLoading } = useIngredientFilter({
    category: selectedCategory,
    sortBy,
  });
  const { isFavorited, toggleFavorite } = useFavorites();

  const categories: MealCategory[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="space-y-6">
      <AnimatedContainer>
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Find Meals by Ingredients
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Add your available ingredients and we'll show you matching recipes
          </p>
        </div>

        <Card glass>
          <div className="space-y-4">
            <IngredientInput
              onAdd={addIngredient}
              suggestions={allIngredients}
            />

            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <AnimatePresence>
                  {ingredients.map((ingredient) => (
                    <IngredientTag
                      key={ingredient}
                      ingredient={ingredient}
                      onRemove={() => removeIngredient(ingredient)}
                    />
                  ))}
                </AnimatePresence>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearIngredients}
                  className="ml-2"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </Card>
      </AnimatedContainer>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === undefined ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory(undefined)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="
            px-4 py-2 rounded-xl
            bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-600
            text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-primary-500
          "
        >
          <option value="match">Best Match</option>
          <option value="random">Random</option>
          <option value="category">Category</option>
          <option value="name">Name</option>
        </select>
      </div>

      {ingredients.length > 0 && filteredMeals.length > 0 && (
        <div className="flex items-center justify-between p-4 glass-card">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Found {filteredMeals.length} matching {filteredMeals.length === 1 ? 'meal' : 'meals'}
          </span>
        </div>
      )}

      {filteredMeals.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredMeals.map((meal, index) => (
              <motion.div
                key={meal.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <MealCard
                  meal={meal}
                  matchPercentage={ingredients.length > 0 ? meal.matchPercentage : undefined}
                  onView={() => setSelectedMeal(meal)}
                  onFavorite={() => toggleFavorite(meal.id)}
                  isFavorited={isFavorited(meal.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : ingredients.length > 0 ? (
        <EmptyState
          icon={Search}
          title="No meals found"
          description="Try adjusting your ingredients or filters"
          action={
            <Button onClick={clearIngredients} variant="secondary">
              Clear Ingredients
            </Button>
          }
        />
      ) : (
        <EmptyState
          icon={Search}
          title="Add ingredients to start"
          description="Enter the ingredients you have available and we'll find matching recipes"
        />
      )}

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

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Button, EmptyState } from '../../components/ui';
import { IngredientInput } from '../../components/ingredients/IngredientInput';
import { IngredientTag } from '../../components/ingredients/IngredientTag';
import { MealCard } from '../../components/meal/MealCard';
import { MealDetailsModal } from '../../components/meal/MealDetailsModal';
import { useMeals } from '../../hooks';
import { useAppStore } from '../../stores/useAppStore';
import { filterMealsByIngredients } from '../../utils/matching';
import type { Meal, IngredientMatch } from '../../types';

export default function IngredientsPage() {
  const { data: meals } = useMeals();
  const ingredients = useAppStore(state => state.ingredients);
  const addIngredient = useAppStore(state => state.addIngredient);
  const removeIngredient = useAppStore(state => state.removeIngredient);
  const clearIngredients = useAppStore(state => state.clearIngredients);

  const [filteredMeals, setFilteredMeals] = useState<IngredientMatch[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<IngredientMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allIngredients = meals
    ? Array.from(new Set(meals.flatMap(m => m.ingredients)))
    : [];

  useEffect(() => {
    if (meals && ingredients.length > 0) {
      const matches = filterMealsByIngredients(meals, ingredients);
      setFilteredMeals(matches);
    } else {
      setFilteredMeals([]);
    }
  }, [meals, ingredients]);

  const handleMealClick = (match: IngredientMatch) => {
    setSelectedMeal(match);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
          Find Meals by Ingredients
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Enter ingredients you have and discover meals you can make
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-4">
        <IngredientInput
          onAdd={addIngredient}
          suggestions={allIngredients}
        />

        {ingredients.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Ingredients ({ingredients.length})
              </span>
              <button
                onClick={clearIngredients}
                className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {ingredients.map((ingredient) => (
                  <IngredientTag
                    key={ingredient}
                    ingredient={ingredient}
                    onRemove={() => removeIngredient(ingredient)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto">
        {ingredients.length === 0 ? (
          <EmptyState
            icon={<Search className="w-16 h-16" />}
            title="Add ingredients to start"
            description="Enter the ingredients you have available and we'll find matching meals for you"
          />
        ) : filteredMeals.length === 0 ? (
          <EmptyState
            icon={<Search className="w-16 h-16" />}
            title="No meals found"
            description="Try adding different ingredients or removing some to see more results"
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Matching Meals ({filteredMeals.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeals.map((match) => (
                <MealCard
                  key={match.meal.id}
                  meal={match.meal}
                  matchPercentage={match.matchPercentage}
                  onClick={() => handleMealClick(match)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <MealDetailsModal
        meal={selectedMeal?.meal || null}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        matchPercentage={selectedMeal?.matchPercentage}
        matchedIngredients={selectedMeal?.matchedIngredients}
        missingIngredients={selectedMeal?.missingIngredients}
      />
    </div>
  );
}

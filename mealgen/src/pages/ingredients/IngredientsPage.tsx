import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BeakerIcon } from '@heroicons/react/24/outline';
import { AnimatedContainer, EmptyState, LoadingSkeleton, Button } from '@/components/ui';
import { MealCard, MealDetailsModal } from '@/components/meal';
import { IngredientInput, IngredientTag } from '@/components/ingredients';
import { AppLayout } from '@/components/layout';
import { useMeals } from '@/hooks/useMeals';
import { useAppStore } from '@/stores/useAppStore';
import { filterMealsByIngredients, extractUniqueIngredients, suggestIngredients } from '@/utils/matching';
import type { Meal } from '@/types';

export function IngredientsPage() {
  const { data: meals, isLoading } = useMeals();
  const ingredients = useAppStore((state) => state.ingredients);
  const addIngredient = useAppStore((state) => state.addIngredient);
  const removeIngredient = useAppStore((state) => state.removeIngredient);
  const clearIngredients = useAppStore((state) => state.clearIngredients);
  const isFavorite = useAppStore((state) => state.isFavorite);
  const addFavorite = useAppStore((state) => state.addFavorite);
  const removeFavorite = useAppStore((state) => state.removeFavorite);

  const [inputValue, setInputValue] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  // Extract all available ingredients for suggestions
  const allIngredients = useMemo(() => {
    if (!meals) return [];
    return extractUniqueIngredients(meals);
  }, [meals]);

  // Get suggestions based on input
  const suggestions = useMemo(() => {
    if (!inputValue || inputValue.length < 2) return [];
    return suggestIngredients(inputValue, allIngredients).filter(
      (suggestion) => !ingredients.includes(suggestion.toLowerCase())
    );
  }, [inputValue, allIngredients, ingredients]);

  // Filter meals based on ingredients
  const filteredMeals = useMemo(() => {
    if (!meals || ingredients.length === 0) return [];
    return filterMealsByIngredients(meals, ingredients);
  }, [meals, ingredients]);

  const handleAddIngredient = (ingredient: string) => {
    addIngredient(ingredient);
    setInputValue('');
  };

  const handleToggleFavorite = (mealId: string) => {
    if (isFavorite(mealId)) {
      removeFavorite(mealId);
    } else {
      addFavorite(mealId);
    }
  };

  return (
    <AppLayout>
      <AnimatedContainer>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Find Meals by{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Ingredients
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Add ingredients you have, and we'll find matching meals
          </p>
        </div>

        {/* Ingredient Input */}
        <div className="mb-6">
          <IngredientInput
            value={inputValue}
            onChange={setInputValue}
            onAdd={handleAddIngredient}
            suggestions={suggestions}
            placeholder="Type an ingredient (e.g., chicken, tomato)..."
          />
        </div>

        {/* Selected Ingredients */}
        {ingredients.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Ingredients ({ingredients.length})
              </h2>
              <Button
                onClick={clearIngredients}
                variant="ghost"
                size="sm"
              >
                Clear All
              </Button>
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

        {/* Results */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {ingredients.length > 0
              ? `Matching Meals (${filteredMeals.length})`
              : 'Add ingredients to find meals'}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <LoadingSkeleton count={6} height="h-96" />
            </div>
          ) : ingredients.length === 0 ? (
            <EmptyState
              icon={<BeakerIcon className="w-16 h-16" />}
              title="No ingredients added"
              description="Start by adding some ingredients you have available, and we'll show you matching meal options."
            />
          ) : filteredMeals.length === 0 ? (
            <EmptyState
              icon={<BeakerIcon className="w-16 h-16" />}
              title="No matching meals found"
              description="Try adjusting your ingredients to find more meal options."
              action={{
                label: 'Clear Ingredients',
                onClick: clearIngredients,
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeals.map((match) => (
                <MealCard
                  key={match.meal.id}
                  meal={match.meal}
                  matchPercentage={match.matchPercentage}
                  onFavorite={() => handleToggleFavorite(match.meal.id)}
                  isFavorite={isFavorite(match.meal.id)}
                  onClick={() => setSelectedMeal(match.meal)}
                  showActions
                />
              ))}
            </div>
          )}
        </div>

        {/* Meal Details Modal */}
        <MealDetailsModal
          meal={selectedMeal}
          isOpen={!!selectedMeal}
          onClose={() => setSelectedMeal(null)}
          onFavorite={
            selectedMeal ? () => handleToggleFavorite(selectedMeal.id) : undefined
          }
          isFavorite={selectedMeal ? isFavorite(selectedMeal.id) : false}
        />
      </AnimatedContainer>
    </AppLayout>
  );
}

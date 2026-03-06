import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { IngredientInput } from '@/components/ingredients/IngredientInput';
import { IngredientTag } from '@/components/ingredients/IngredientTag';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { useMeals } from '@/hooks/useMeals';
import { useFavorites } from '@/hooks/useFavorites';
import { useAppStore } from '@/stores/useAppStore';
import { filterMealsByIngredients, suggestIngredients, extractUniqueIngredients } from '@/utils/matching';
import { BeakerIcon } from '@heroicons/react/24/outline';
import type { Meal } from '@/types';
import { AnimatePresence } from 'framer-motion';

export function IngredientsPage() {
  const { data: meals = [] } = useMeals();
  const { addFavorite, removeFavorite } = useFavorites();
  const ingredients = useAppStore(state => state.ingredients);
  const addIngredient = useAppStore(state => state.addIngredient);
  const removeIngredient = useAppStore(state => state.removeIngredient);
  const user = useAppStore(state => state.user);
  const isFavorite = useAppStore(state => state.isFavorite);

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [inputValue, setInputValue] = useState('');

  const allIngredients = useMemo(() => extractUniqueIngredients(meals), [meals]);

  const suggestions = useMemo(
    () => suggestIngredients(inputValue, allIngredients),
    [inputValue, allIngredients]
  );

  const filteredMeals = useMemo(
    () => filterMealsByIngredients(meals, ingredients),
    [meals, ingredients]
  );

  const handleFavoriteToggle = (mealId: string) => {
    if (isFavorite(mealId)) {
      removeFavorite(mealId);
    } else {
      addFavorite(mealId);
    }
  };

  return (
    <AppLayout>
      <AnimatedContainer className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Ingredient-Based Meal Finder</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your available ingredients and discover meals you can make
          </p>
        </div>

        <div className="glass-card p-6 mb-8">
          <IngredientInput
            value={inputValue}
            onChange={setInputValue}
            onAdd={addIngredient}
            suggestions={suggestions}
            placeholder="Type an ingredient (e.g., chicken, tomato, pasta)..."
          />

          {ingredients.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <AnimatePresence>
                {ingredients.map(ingredient => (
                  <IngredientTag
                    key={ingredient}
                    ingredient={ingredient}
                    onRemove={() => removeIngredient(ingredient)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {ingredients.length === 0 ? (
          <EmptyState
            title="Add ingredients to get started"
            description="Enter the ingredients you have available and we'll find matching meals"
            icon={<BeakerIcon className="w-16 h-16" />}
          />
        ) : filteredMeals.length === 0 ? (
          <EmptyState
            title="No meals found"
            description="Try adding different ingredients or remove some to see more results"
            icon={<BeakerIcon className="w-16 h-16" />}
          />
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                Found {filteredMeals.length} meal{filteredMeals.length !== 1 ? 's' : ''}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeals.map(match => (
                <MealCard
                  key={match.meal.id}
                  meal={match.meal}
                  matchPercentage={match.matchPercentage}
                  onFavorite={() => handleFavoriteToggle(match.meal.id)}
                  isFavorite={isFavorite(match.meal.id)}
                  onClick={() => setSelectedMeal(match.meal)}
                  showActions={!!user}
                />
              ))}
            </div>
          </>
        )}

        <MealDetailsModal
          meal={selectedMeal}
          isOpen={!!selectedMeal}
          onClose={() => setSelectedMeal(null)}
          onFavorite={selectedMeal ? () => handleFavoriteToggle(selectedMeal.id) : undefined}
          isFavorite={selectedMeal ? isFavorite(selectedMeal.id) : false}
        />
      </AnimatedContainer>
    </AppLayout>
  );
}

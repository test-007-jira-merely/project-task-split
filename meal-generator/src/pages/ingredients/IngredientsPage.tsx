import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { IngredientInput } from '@/components/ingredients/IngredientInput';
import { IngredientTag } from '@/components/ingredients/IngredientTag';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search } from 'lucide-react';
import { mealService } from '@/services/mealService';
import { useAppStore } from '@/stores/useAppStore';
import { filterMealsByIngredients, getAllIngredientsFromMeals } from '@/utils/matching';
import type { Meal } from '@/types/meal';

export function IngredientsPage() {
  const { selectedIngredients, addIngredient, removeIngredient } = useAppStore();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: mealService.getAllMeals,
  });

  const suggestions = useMemo(() => getAllIngredientsFromMeals(meals), [meals]);
  const filteredMeals = useMemo(
    () => filterMealsByIngredients(meals, selectedIngredients),
    [meals, selectedIngredients]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Find Meals by Ingredients
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Enter ingredients you have and discover matching recipes
        </p>
      </div>

      <div className="glass rounded-2xl p-6 mb-8">
        <IngredientInput onAdd={addIngredient} suggestions={suggestions} />

        {selectedIngredients.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <AnimatePresence>
              {selectedIngredients.map((ingredient) => (
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

      {selectedIngredients.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Start by adding ingredients"
          description="Add ingredients you have available and we'll show you matching recipes"
        />
      ) : filteredMeals.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching meals found"
          description="Try adding different ingredients or removing some to see more results"
        />
      ) : (
        <div>
          <div className="mb-4 text-gray-700 dark:text-gray-300">
            Found <span className="font-bold">{filteredMeals.length}</span> matching meal{filteredMeals.length !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onView={setSelectedMeal}
                matchPercentage={meal.matchPercentage}
              />
            ))}
          </div>
        </div>
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />
    </div>
  );
}

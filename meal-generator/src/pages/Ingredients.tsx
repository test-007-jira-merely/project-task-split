import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useAppStore } from '@stores/useAppStore';
import { IngredientInput } from '@components/ingredients/IngredientInput';
import { IngredientTag } from '@components/ingredients/IngredientTag';
import { IngredientSuggestions } from '@components/ingredients/IngredientSuggestions';
import { CategoryFilter } from '@components/meal/CategoryFilter';
import { MealCard } from '@components/meal/MealCard';
import { MealDetailsModal } from '@components/meal/MealDetailsModal';
import { EmptyState } from '@components/ui/EmptyState';
import { Button } from '@components/ui/Button';
import { useIngredientFilter } from '@features/ingredient-filter/useIngredientFilter';
import type { Meal } from '@types/meal';

export function Ingredients() {
  const { selectedIngredients, addIngredient, removeIngredient, clearIngredients } = useAppStore();
  const { matches, selectedCategory, setSelectedCategory } = useIngredientFilter();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Find Meals by Ingredients
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Add ingredients you have, and we'll find recipes you can make
        </p>
      </div>

      <div className="glass rounded-3xl p-6 space-y-6">
        <IngredientInput onAdd={addIngredient} />

        {selectedIngredients.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Selected Ingredients ({selectedIngredients.length})
              </h3>
              <Button size="sm" variant="ghost" onClick={clearIngredients}>
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
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
          </div>
        )}

        <IngredientSuggestions suggestions={[]} onSelect={addIngredient} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {selectedIngredients.length > 0 ? 'Matching Meals' : 'All Meals'}
            {matches.length > 0 && <span className="text-neutral-500 ml-2">({matches.length})</span>}
          </h2>
        </div>

        <div className="mb-6">
          <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
        </div>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map(({ meal, matchPercentage }) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onClick={() => setSelectedMeal(meal)}
                matchPercentage={selectedIngredients.length > 0 ? matchPercentage : undefined}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Search className="w-16 h-16" />}
            title="No meals found"
            description={
              selectedIngredients.length > 0
                ? "We couldn't find any meals with these ingredients. Try different combinations!"
                : 'Add some ingredients to find matching meals'
            }
          />
        )}
      </div>

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />
    </div>
  );
}

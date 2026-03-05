import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, EmptyState } from '@/components/ui';
import { IngredientInput, IngredientTag } from '@/components/ingredients';
import { MealCard, MealDetailsModal } from '@/components/meal';
import { useIngredientFilter } from '@/features/ingredient-filter/useIngredientFilter';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useAppStore } from '@/stores/useAppStore';
import { Meal } from '@/types';

const IngredientsPage: React.FC = () => {
  const {
    selectedIngredients,
    filteredMeals,
    addIngredient,
    removeIngredient,
    clearIngredients,
    getSuggestions,
  } = useIngredientFilter();

  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAppStore();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Find by Ingredients</h1>
        <p className="text-muted-foreground">
          Add the ingredients you have and discover meals you can make
        </p>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-glass">
        <IngredientInput
          onAdd={addIngredient}
          suggestions={getSuggestions('')}
          placeholder="Type an ingredient (e.g., chicken, tomato)..."
        />

        {selectedIngredients.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">
                Selected ({selectedIngredients.length})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearIngredients}
              >
                <X className="h-4 w-4 mr-1" />
                Clear all
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
      </div>

      <div>
        {filteredMeals.length > 0 && (
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Found {filteredMeals.length} meal{filteredMeals.length !== 1 ? 's' : ''}
          </h2>
        )}

        {selectedIngredients.length === 0 ? (
          <EmptyState
            icon={<Search className="h-16 w-16" />}
            title="Add ingredients to get started"
            description="Type ingredients you have available and we'll show you what you can cook"
          />
        ) : filteredMeals.length === 0 ? (
          <EmptyState
            icon={<Search className="h-16 w-16" />}
            title="No meals found"
            description="Try different ingredients or remove some filters"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeals.map((meal) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <MealCard
                  meal={meal}
                  onView={setSelectedMeal}
                  onFavorite={user ? toggleFavorite : undefined}
                  isFavorite={user ? isFavorite(meal.id) : false}
                  showMatch
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onFavorite={user ? toggleFavorite : undefined}
        isFavorite={selectedMeal ? isFavorite(selectedMeal.id) : false}
      />
    </div>
  );
};

export default IngredientsPage;

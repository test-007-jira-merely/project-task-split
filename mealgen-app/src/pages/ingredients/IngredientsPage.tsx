import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import MealCard from '@/components/meal/MealCard';
import MealDetailsModal from '@/components/meal/MealDetailsModal';
import IngredientInput from '@/components/ingredients/IngredientInput';
import IngredientTag from '@/components/ingredients/IngredientTag';
import CategoryFilter from '@/components/ingredients/CategoryFilter';
import { useIngredientFilter } from '@/features/ingredient-filter/useIngredientFilter';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import type { MealWithMatch, SortOption } from '@/types';

export default function IngredientsPage() {
  const {
    selectedIngredients,
    filteredMeals,
    filters,
    sortOption,
    suggestions,
    addIngredient,
    removeIngredient,
    clearIngredients,
    setFilters,
    setSortOption,
  } = useIngredientFilter();

  const { isFavorite, addToFavorites, removeFromFavorites, getFavoriteId } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [selectedMeal, setSelectedMeal] = useState<MealWithMatch | null>(null);

  const handleFavoriteToggle = (mealId: string) => {
    if (!isAuthenticated) return;

    if (isFavorite(mealId)) {
      const favoriteId = getFavoriteId(mealId);
      if (favoriteId) removeFromFavorites(favoriteId);
    } else {
      addToFavorites(mealId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Find Meals by Ingredients
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Add the ingredients you have and discover what you can make
        </p>
      </div>

      {/* Ingredient Input */}
      <div className="mb-6">
        <IngredientInput onAdd={addIngredient} suggestions={suggestions} />
      </div>

      {/* Selected Ingredients */}
      {selectedIngredients.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Selected Ingredients ({selectedIngredients.length})
            </h2>
            <Button variant="ghost" size="sm" onClick={clearIngredients}>
              <X className="w-4 h-4 mr-1" />
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

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </h3>
          <CategoryFilter
            selected={filters.category}
            onChange={(category) => setFilters({ ...filters, category })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Sort by
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="match">Best Match</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="random">Random</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Found {filteredMeals.length} meal{filteredMeals.length !== 1 ? 's' : ''}
        </p>
      </div>

      {filteredMeals.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onClick={() => setSelectedMeal(meal)}
              onFavoriteToggle={
                isAuthenticated
                  ? () => handleFavoriteToggle(meal.id)
                  : undefined
              }
              isFavorite={isAuthenticated ? isFavorite(meal.id) : false}
              showMatch={selectedIngredients.length > 0}
            />
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon={<X className="w-16 h-16" />}
          title="No meals found"
          description={
            selectedIngredients.length > 0
              ? "Try adjusting your ingredients or filters to find more meals"
              : "Add some ingredients to start finding meals"
          }
        />
      )}

      {/* Meal Details Modal */}
      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onFavoriteToggle={
          isAuthenticated && selectedMeal
            ? () => handleFavoriteToggle(selectedMeal.id)
            : undefined
        }
        isFavorite={isAuthenticated && selectedMeal ? isFavorite(selectedMeal.id) : false}
      />
    </div>
  );
}

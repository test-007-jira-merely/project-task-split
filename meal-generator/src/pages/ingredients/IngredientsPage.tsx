import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { useMeals } from '../../hooks/useMeals';
import { IngredientInput } from '../../components/ingredients/IngredientInput';
import { IngredientTag } from '../../components/ingredients/IngredientTag';
import { MealCard } from '../../components/meal/MealCard';
import { MealDetailsModal } from '../../components/meal/MealDetailsModal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { filterMealsByIngredients } from '../../utils/matching';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';

const IngredientsPage = () => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { selectedIngredients, addIngredient, removeIngredient, clearIngredients } =
    useAppStore();
  const { data: meals = [], isLoading } = useMeals();

  const allIngredients = useMemo(() => {
    const ingredientsSet = new Set<string>();
    meals.forEach((meal) => {
      meal.ingredients.forEach((ingredient) => {
        ingredientsSet.add(ingredient);
      });
    });
    return Array.from(ingredientsSet).sort();
  }, [meals]);

  const filteredMeals = useMemo(() => {
    return filterMealsByIngredients(meals, selectedIngredients);
  }, [meals, selectedIngredients]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
          Find Meals by Ingredients
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Add your available ingredients and discover matching recipes
        </p>
      </motion.div>

      <div className="mb-8">
        <IngredientInput onAdd={addIngredient} suggestions={allIngredients} />
      </div>

      {selectedIngredients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Selected Ingredients ({selectedIngredients.length})
            </h3>
            <Button onClick={clearIngredients} variant="ghost" size="sm">
              <X className="w-4 h-4 mr-2" />
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
        </motion.div>
      )}

      {selectedIngredients.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Add Ingredients to Start"
          description="Type in the ingredients you have available, and we'll show you all the delicious meals you can make!"
        />
      ) : filteredMeals.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Matching Meals"
          description="Try adding different ingredients or removing some to see more options."
          action={
            <Button onClick={clearIngredients} variant="primary">
              Clear Ingredients
            </Button>
          }
        />
      ) : (
        <div>
          <h3 className="text-2xl font-bold mb-6">
            Found {filteredMeals.length} Matching Meal{filteredMeals.length !== 1 ? 's' : ''}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMeals.map(({ meal, matchPercentage }) => (
              <MealCard
                key={meal.id}
                meal={meal}
                matchPercentage={matchPercentage}
                onViewDetails={() => {
                  setSelectedMeal(meal);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default IngredientsPage;

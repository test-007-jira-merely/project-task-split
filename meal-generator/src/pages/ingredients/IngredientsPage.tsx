import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useMeals } from '@/hooks/useMeals';
import { IngredientInput } from '@/components/ingredients/IngredientInput';
import { IngredientTag } from '@/components/ingredients/IngredientTag';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { filterMealsByIngredients } from '@/utils/matching';
import { Meal } from '@/types';
import { Search } from 'lucide-react';

export function IngredientsPage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: meals = [], isLoading } = useMeals();

  // Get all unique ingredients for suggestions
  const allIngredients = useMemo(() => {
    const ingredientSet = new Set<string>();
    meals.forEach((meal) => {
      meal.ingredients.forEach((ing) => ingredientSet.add(ing));
    });
    return Array.from(ingredientSet).sort();
  }, [meals]);

  const filteredMeals = useMemo(() => {
    if (ingredients.length === 0) return [];
    return filterMealsByIngredients(meals, ingredients);
  }, [meals, ingredients]);

  const handleAddIngredient = (ingredient: string) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  if (isLoading) {
    return <LoadingSkeleton className="h-96" />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Find Meals by Ingredients
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Enter your available ingredients to find matching recipes
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <IngredientInput onAdd={handleAddIngredient} suggestions={allIngredients} />

        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {ingredients.map((ingredient) => (
                <IngredientTag
                  key={ingredient}
                  ingredient={ingredient}
                  onRemove={() => handleRemoveIngredient(ingredient)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div>
        {filteredMeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                matchPercentage={meal.matchPercentage}
                onClick={() => {
                  setSelectedMeal(meal);
                  setModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : ingredients.length > 0 ? (
          <EmptyState
            icon={<Search className="w-16 h-16" />}
            title="No Matching Meals"
            description="Try adding more ingredients or removing some to find recipes."
          />
        ) : (
          <EmptyState
            icon={<Search className="w-16 h-16" />}
            title="Start Adding Ingredients"
            description="Add ingredients you have to discover recipes you can make."
          />
        )}
      </div>

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

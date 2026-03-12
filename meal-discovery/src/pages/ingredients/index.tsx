import { useState, useEffect } from 'react';
import { IngredientInput } from '@/components/ingredients/IngredientInput';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { AnimatedContainer } from '@/components/AnimatedContainer';
import { EmptyState } from '@/components/EmptyState';
import { useMeals } from '@/hooks/useMeals';
import { useFavorites } from '@/hooks/useFavorites';
import { useAppStore } from '@/stores/useAppStore';
import { matchingEngine } from '@/utils/matching';
import { Meal } from '@/types';
import { Search } from 'lucide-react';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

const Ingredients = () => {
  const { data: meals, isLoading } = useMeals();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { ingredients, addIngredient, removeIngredient, setFilteredMeals } = useAppStore();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filteredResults, setFilteredResults] = useState<Array<{ meal: Meal; matchPercentage: number }>>([]);

  useEffect(() => {
    if (meals) {
      const allIngredients = matchingEngine.extractUniqueIngredients(meals);
      setSuggestions(allIngredients);
    }
  }, [meals]);

  useEffect(() => {
    if (meals) {
      const results = matchingEngine.filterMealsByIngredients(meals, ingredients);
      setFilteredResults(results);
      setFilteredMeals(results.map(r => r.meal));
    }
  }, [meals, ingredients, setFilteredMeals]);

  const handleToggleFavorite = (mealId: string) => {
    if (isFavorite(mealId)) {
      removeFavorite(mealId);
    } else {
      addFavorite(mealId);
    }
  };

  const handleIngredientsChange = (newIngredients: string[]) => {
    // Clear old ingredients and add new ones
    ingredients.forEach(ing => removeIngredient(ing));
    newIngredients.forEach(ing => addIngredient(ing));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LoadingSkeleton type="card" count={6} />
      </div>
    );
  }

  return (
    <div>
      <AnimatedContainer animation="fade">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Find Meals by Ingredients</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter the ingredients you have and discover matching meals
          </p>
        </div>

        <div className="mb-8 max-w-2xl">
          <IngredientInput
            value={ingredients}
            onChange={handleIngredientsChange}
            suggestions={suggestions}
            placeholder="Type an ingredient (e.g., chicken, tomato)..."
          />
        </div>

        {ingredients.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Found {filteredResults.length} meal{filteredResults.length !== 1 ? 's' : ''} matching your ingredients
            </p>
          </div>
        )}

        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map(({ meal, matchPercentage }, index) => (
              <AnimatedContainer key={meal.id} animation="slide" delay={index * 0.05}>
                <MealCard
                  meal={meal}
                  matchPercentage={matchPercentage}
                  onFavorite={handleToggleFavorite}
                  onViewDetails={setSelectedMeal}
                  isFavorite={isFavorite(meal.id)}
                  showActions
                />
              </AnimatedContainer>
            ))}
          </div>
        ) : ingredients.length > 0 ? (
          <EmptyState
            icon={<Search className="w-16 h-16" />}
            title="No meals found"
            description="Try adding different ingredients or removing some filters"
          />
        ) : (
          <EmptyState
            icon={<Search className="w-16 h-16" />}
            title="Start by adding ingredients"
            description="Type ingredients you have available and we'll find matching meals"
          />
        )}
      </AnimatedContainer>

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onFavorite={handleToggleFavorite}
        isFavorite={selectedMeal ? isFavorite(selectedMeal.id) : false}
      />
    </div>
  );
};

export default Ingredients;

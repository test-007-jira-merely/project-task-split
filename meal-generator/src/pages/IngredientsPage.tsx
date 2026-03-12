import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { IngredientInput } from '../components/ingredients/IngredientInput';
import { IngredientTagList } from '../components/ingredients/IngredientTagList';
import { MealCard } from '../components/meal/MealCard';
import { MealDetailsModal } from '../components/meal/MealDetailsModal';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../stores/useAppStore';
import { mealService } from '../services/mealService';
import type { Meal } from '../types/database';
import type { IngredientMatch } from '../types/store';

export const IngredientsPage = () => {
  const {
    selectedIngredients,
    addIngredient,
    removeIngredient,
    clearIngredients,
    filteredMeals,
    setFilteredMeals,
  } = useAppStore();

  const [allIngredients, setAllIngredients] = useState<string[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<IngredientMatch | null>(null);

  // Load all unique ingredients on mount
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const meals = await mealService.getAllMeals();
        const ingredientsSet = new Set<string>();
        meals.forEach((meal) => {
          meal.ingredients.forEach((ing) => ingredientsSet.add(ing));
        });
        setAllIngredients(Array.from(ingredientsSet).sort());
      } catch (error) {
        console.error('Failed to load ingredients:', error);
      }
    };
    loadIngredients();
  }, []);

  const handleSearch = async () => {
    if (selectedIngredients.length === 0) return;

    setLoading(true);
    try {
      const matches = await mealService.findMealsByIngredients(selectedIngredients);
      setFilteredMeals(matches);
    } catch (error) {
      console.error('Failed to search meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (match: IngredientMatch) => {
    setSelectedMeal(match.meal);
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Find Meals by Ingredients
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Add ingredients you have and discover matching meals
          </p>
        </div>

        {/* Ingredient Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Ingredients
          </h2>
          <div className="mb-4">
            <IngredientInput onAdd={addIngredient} suggestions={allIngredients} />
          </div>
          <div className="mb-4">
            <IngredientTagList ingredients={selectedIngredients} onRemove={removeIngredient} />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSearch}
              disabled={selectedIngredients.length === 0}
              loading={loading}
              className="flex-1"
            >
              <Search className="h-5 w-5 mr-2" />
              Find Matching Meals
            </Button>
            {selectedIngredients.length > 0 && (
              <Button onClick={clearIngredients} variant="outline">
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Matching Meals ({filteredMeals.length})
          </h2>

          {filteredMeals.length === 0 ? (
            <EmptyState
              title="No matching meals yet"
              description="Add some ingredients and search to find meals you can cook!"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeals.map((match) => (
                <MealCard
                  key={match.meal.id}
                  meal={match.meal}
                  onView={() => handleViewDetails(match)}
                  showMatchPercentage={match.matchPercentage}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedMatch && (
          <MealDetailsModal
            meal={selectedMeal}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            matchedIngredients={selectedMatch.matchedIngredients}
            missingIngredients={selectedMatch.missingIngredients}
          />
        )}
      </div>
    </AppLayout>
  );
};

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { AnimatedContainer } from '../../components/ui/AnimatedContainer';
import { EmptyState } from '../../components/ui/EmptyState';
import { IngredientInput } from '../../components/ingredients/IngredientInput';
import { IngredientTag } from '../../components/ingredients/IngredientTag';
import { IngredientSuggestions } from '../../components/ingredients/IngredientSuggestions';
import { MealCard } from '../../components/meal/MealCard';
import { MealDetailsModal } from '../../components/meal/MealDetailsModal';
import { fetchMeals, fetchFavorites, addFavorite, removeFavorite } from '../../services/mealService';
import { useAppStore } from '../../stores/useAppStore';
import { filterMealsByIngredients } from '../../utils/matching';
import type { Meal } from '../../types';
import { AnimatePresence } from 'framer-motion';

const COMMON_INGREDIENTS = [
  'chicken', 'beef', 'rice', 'pasta', 'eggs', 'tomatoes', 'onion', 'garlic',
  'cheese', 'butter', 'milk', 'flour', 'salt', 'pepper', 'olive oil', 'bread'
];

export const IngredientsPage = () => {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, ingredients, addIngredient, removeIngredient, filteredMeals, setFilteredMeals } = useAppStore();

  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: fetchMeals,
  });

  const { data: favorites = [], refetch: refetchFavorites } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => (user ? fetchFavorites(user.id) : []),
    enabled: !!user,
  });

  useEffect(() => {
    if (ingredients.length > 0) {
      const matches = filterMealsByIngredients(meals, ingredients);
      setFilteredMeals(matches);
    } else {
      setFilteredMeals([]);
    }
  }, [ingredients, meals, setFilteredMeals]);

  const handleToggleFavorite = async (mealId: string) => {
    if (!user) return;

    const existingFavorite = favorites.find((f) => f.meal_id === mealId);

    try {
      if (existingFavorite) {
        await removeFavorite(existingFavorite.id);
      } else {
        await addFavorite(user.id, mealId);
      }
      refetchFavorites();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const isFavorite = (mealId: string) => favorites.some((f) => f.meal_id === mealId);

  const availableSuggestions = COMMON_INGREDIENTS.filter(
    (ing) => !ingredients.some((i) => i.toLowerCase() === ing.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <AnimatedContainer>
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
            Find Meals by Ingredients
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Enter the ingredients you have and discover meals you can make
          </p>
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.1}>
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-glass dark:shadow-glass-dark p-6 space-y-4">
          <IngredientInput onAdd={addIngredient} placeholder="Add an ingredient..." />

          {ingredients.length > 0 && (
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
          )}

          <IngredientSuggestions
            suggestions={availableSuggestions.slice(0, 8)}
            onSelect={addIngredient}
          />
        </div>
      </AnimatedContainer>

      {filteredMeals.length > 0 && (
        <AnimatedContainer delay={0.2}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Found {filteredMeals.length} {filteredMeals.length === 1 ? 'meal' : 'meals'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeals.map(({ meal, matchPercentage }) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onView={() => {
                  setSelectedMeal(meal);
                  setIsModalOpen(true);
                }}
                onFavorite={user ? () => handleToggleFavorite(meal.id) : undefined}
                isFavorite={isFavorite(meal.id)}
                showMatchIndicator
                matchPercentage={matchPercentage}
              />
            ))}
          </div>
        </AnimatedContainer>
      )}

      {ingredients.length > 0 && filteredMeals.length === 0 && (
        <EmptyState
          icon={Search}
          title="No meals found"
          description="Try adding different ingredients or remove some to see more results"
        />
      )}

      {ingredients.length === 0 && (
        <EmptyState
          icon={Search}
          title="Start adding ingredients"
          description="Add ingredients you have available to find matching meals"
        />
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { mealService } from '../../services/mealService';
import { useAppStore } from '../../stores/useAppStore';
import { useAuth } from '../../hooks/useAuth';
import { filterMealsByIngredients, getUniqueIngredients } from '../../utils/matching';
import { IngredientInput } from '../../components/ingredients/IngredientInput';
import { IngredientTag } from '../../components/ingredients/IngredientTag';
import { MealCard } from '../../components/meal/MealCard';
import { MealDetailsModal } from '../../components/meal/MealDetailsModal';
import { EmptyState } from '../../components/ui/EmptyState';
import type { Meal } from '../../types';

export function Ingredients() {
  const { user } = useAuth();
  const { ingredients, addIngredient, removeIngredient } = useAppStore();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: () => mealService.getAllMeals(),
  });

  const { data: userFavorites = [], refetch: refetchFavorites } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => user ? mealService.getFavorites(user.id) : [],
    enabled: !!user,
  });

  const suggestions = getUniqueIngredients(meals);
  const matches = filterMealsByIngredients(meals, ingredients);

  const handleToggleFavorite = async (mealId: string) => {
    if (!user) return;

    const isFavorite = userFavorites.some(f => f.mealId === mealId);

    if (isFavorite) {
      await mealService.removeFavorite(user.id, mealId);
    } else {
      await mealService.addFavorite(user.id, mealId);
    }
    refetchFavorites();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Find Meals by Ingredients
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Enter ingredients you have and discover what you can cook
        </p>
      </div>

      <div className="card p-6">
        <IngredientInput
          onAdd={addIngredient}
          suggestions={suggestions}
        />

        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
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
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {ingredients.length > 0 ? 'Matched Meals' : 'All Meals'}
          </h2>
          <span className="text-gray-600 dark:text-gray-400">
            {matches.length} {matches.length === 1 ? 'meal' : 'meals'}
          </span>
        </div>

        {matches.length === 0 ? (
          <EmptyState
            icon={<Search className="w-16 h-16" />}
            title="No meals found"
            description="Try adding different ingredients or remove some to see more results"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map(({ meal, matchPercentage }) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onViewDetails={() => {
                  setSelectedMeal(meal);
                  setIsModalOpen(true);
                }}
                onToggleFavorite={user ? () => handleToggleFavorite(meal.id) : undefined}
                isFavorite={userFavorites.some(f => f.mealId === meal.id)}
                matchPercentage={ingredients.length > 0 ? matchPercentage : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {selectedMeal && (
        <MealDetailsModal
          meal={selectedMeal}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onToggleFavorite={user ? () => handleToggleFavorite(selectedMeal.id) : undefined}
          isFavorite={userFavorites.some(f => f.mealId === selectedMeal.id)}
          matchedIngredients={ingredients.length > 0 ?
            filterMealsByIngredients([selectedMeal], ingredients)[0]?.matchedIngredients : undefined
          }
          missingIngredients={ingredients.length > 0 ?
            filterMealsByIngredients([selectedMeal], ingredients)[0]?.missingIngredients : undefined
          }
        />
      )}
    </div>
  );
}

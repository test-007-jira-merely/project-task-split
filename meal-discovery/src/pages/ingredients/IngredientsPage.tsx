import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { IngredientInput } from '@/components/ingredients/IngredientInput';
import { IngredientTag } from '@/components/ingredients/IngredientTag';
import { CategoryFilter } from '@/components/ingredients/CategoryFilter';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppStore } from '@/stores/useAppStore';
import { mealService, favoritesService } from '@/services/supabase';
import { ingredientUtils } from '@/utils/ingredient.utils';
import { Meal, MealMatch } from '@/types/meal.types';

export default function IngredientsPage() {
  const {
    user,
    ingredients,
    addIngredient,
    removeIngredient,
    mealFilter,
    setMealFilter,
    favorites,
    addFavorite,
    removeFavorite,
  } = useAppStore();

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [matchedMeals, setMatchedMeals] = useState<MealMatch[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    mealService.getAllMeals().then(meals => {
      setAllMeals(meals);
      const allIngredients = ingredientUtils.extractAllIngredients(meals);
      setSuggestions(allIngredients);
    });
  }, []);

  useEffect(() => {
    if (ingredients.length > 0) {
      let filtered = mealService.filterMeals(allMeals, {
        ...mealFilter,
        availableIngredients: ingredients,
      });

      const matches = ingredientUtils.findMatchingMeals(filtered, ingredients);
      setMatchedMeals(matches);
    } else {
      setMatchedMeals([]);
    }
  }, [ingredients, mealFilter, allMeals]);

  const handleFavoriteToggle = async (mealId: string) => {
    if (!user) return;

    try {
      const isFav = favorites.includes(mealId);
      if (isFav) {
        await favoritesService.removeFavorite(user.id, mealId);
        removeFavorite(mealId);
      } else {
        await favoritesService.addFavorite(user.id, mealId);
        addFavorite(mealId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div>
      <AnimatedContainer>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Find Meals by Ingredients
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Enter the ingredients you have and discover matching meals
          </p>
        </div>

        {/* Ingredient Input */}
        <div className="mb-6">
          <IngredientInput
            value={inputValue}
            onChange={setInputValue}
            onAdd={addIngredient}
            suggestions={suggestions}
          />
        </div>

        {/* Selected Ingredients */}
        {ingredients.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Your Ingredients ({ingredients.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {ingredients.map(ingredient => (
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

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Filter by Category
          </h3>
          <CategoryFilter
            selected={mealFilter.category}
            onChange={(category) => setMealFilter({ ...mealFilter, category })}
          />
        </div>

        {/* Results */}
        {ingredients.length > 0 ? (
          matchedMeals.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                {matchedMeals.length} Matching Meals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedMeals.map(({ meal, matchPercentage }) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    showMatchIndicator
                    matchPercentage={matchPercentage}
                    isFavorite={favorites.includes(meal.id)}
                    onFavoriteToggle={user ? () => handleFavoriteToggle(meal.id) : undefined}
                    onClick={() => {
                      setSelectedMeal(meal);
                      setShowModal(true);
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No matches found"
              description="Try adding different ingredients or adjusting your filters"
              icon={<Search className="w-16 h-16" />}
            />
          )
        ) : (
          <EmptyState
            title="Start adding ingredients"
            description="Add ingredients above to find meals you can cook"
            icon={<Search className="w-16 h-16" />}
          />
        )}

        {/* Modal */}
        <MealDetailsModal
          meal={selectedMeal}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          isFavorite={selectedMeal ? favorites.includes(selectedMeal.id) : false}
          onFavoriteToggle={
            user && selectedMeal
              ? () => handleFavoriteToggle(selectedMeal.id)
              : undefined
          }
        />
      </AnimatedContainer>
    </div>
  );
}

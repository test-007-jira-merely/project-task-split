import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { IngredientInput } from '@/components/ingredients/IngredientInput';
import { IngredientTag } from '@/components/ingredients/IngredientTag';
import { EmptyState } from '@/components/ui/EmptyState';
import { mealService } from '@/services/mealService';
import { useIngredientMatcher } from '@/hooks/useIngredientMatcher';
import { useMealStore } from '@/stores/useMealStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Meal } from '@/types/models';

export default function IngredientsPage() {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const { ingredients, addIngredient, removeIngredient, clearIngredients } = useMealStore();
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: mealService.getAllMeals,
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => user ? mealService.getFavorites(user.id) : [],
    enabled: !!user,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (mealId: string) => {
      if (!user) throw new Error('Must be logged in');
      const isFav = favorites.some((f) => f.mealId === mealId);
      if (isFav) {
        await mealService.removeFavorite(user.id, mealId);
      } else {
        await mealService.addFavorite(user.id, mealId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  // Get all unique ingredients for suggestions
  const allIngredients = useMemo(() => {
    const ingredientSet = new Set<string>();
    meals.forEach((meal) => {
      meal.ingredients.forEach((ing) => {
        ingredientSet.add(ing.toLowerCase());
      });
    });
    return Array.from(ingredientSet).sort();
  }, [meals]);

  const { matchedMeals, fullMatches, partialMatches } = useIngredientMatcher(meals, ingredients);

  const isFavorite = (mealId: string) =>
    favorites.some((f) => f.mealId === mealId);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Find Meals by Ingredients
        </h1>
        <p className="text-lg text-muted-foreground">
          Enter the ingredients you have and discover matching recipes
        </p>
      </motion.div>

      {/* Ingredient Input */}
      <div className="bg-card rounded-2xl shadow-soft border border-border p-6 space-y-4">
        <IngredientInput
          onAdd={addIngredient}
          suggestions={allIngredients}
        />

        {/* Ingredient Tags */}
        {ingredients.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Selected Ingredients ({ingredients.length})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearIngredients}
              >
                <X size={16} className="mr-2" />
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient) => (
                <IngredientTag
                  key={ingredient}
                  ingredient={ingredient}
                  onRemove={() => removeIngredient(ingredient)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {ingredients.length > 0 ? (
        <div className="space-y-8">
          {/* Full Matches */}
          {fullMatches.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                Perfect Matches ({fullMatches.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullMatches.map((meal) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    showMatch
                    onFavorite={() => toggleFavoriteMutation.mutate(meal.id)}
                    isFavorite={isFavorite(meal.id)}
                    onClick={() => setSelectedMeal(meal)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Partial Matches */}
          {partialMatches.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                Partial Matches ({partialMatches.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partialMatches.map((meal) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    showMatch
                    onFavorite={() => toggleFavoriteMutation.mutate(meal.id)}
                    isFavorite={isFavorite(meal.id)}
                    onClick={() => setSelectedMeal(meal)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No Matches */}
          {matchedMeals.length === 0 && (
            <EmptyState
              icon={<Search size={48} />}
              title="No matching meals found"
              description="Try different ingredients or remove some to see more results"
            />
          )}
        </div>
      ) : (
        <EmptyState
          icon={<Search size={48} />}
          title="Add ingredients to start"
          description="Enter the ingredients you have available to find matching recipes"
        />
      )}

      {/* Meal Details Modal */}
      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />
    </div>
  );
}

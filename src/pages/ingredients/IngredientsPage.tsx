import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { IngredientInput } from '@/components/ingredients/IngredientInput';
import { CategoryFilter } from '@/components/ingredients/CategoryFilter';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useAppStore } from '@/stores/useAppStore';
import { getAllMeals, findMealsByIngredients, filterMeals } from '@/services/mealService';
import { getIngredientSuggestions } from '@/utils/ingredientUtils';
import { addFavorite, removeFavorite } from '@/services/supabaseData';
import { Meal } from '@/types/meal';

export const IngredientsPage = () => {
  const { user, ingredients, addIngredient, removeIngredient, favorites, addFavorite: addFavoriteStore, removeFavorite: removeFavoriteStore, filters, setFilters } = useAppStore();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const { data: allMeals = [], isLoading } = useQuery({
    queryKey: ['meals'],
    queryFn: getAllMeals,
  });

  const allIngredients = useMemo(() => {
    return allMeals.flatMap(meal => meal.ingredients);
  }, [allMeals]);

  const suggestions = useMemo(() => {
    const lastIngredient = ingredients[ingredients.length - 1] || '';
    return getIngredientSuggestions(allIngredients, lastIngredient);
  }, [allIngredients, ingredients]);

  const matchedMeals = useMemo(() => {
    if (ingredients.length === 0) return [];

    const matches = findMealsByIngredients(ingredients, allMeals);
    const filtered = filterMeals(matches.map(m => m.meal), filters);

    return matches
      .filter(m => filtered.some(f => f.id === m.meal.id))
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [ingredients, allMeals, filters]);

  const handleFavorite = async (mealId: string) => {
    if (!user) return;

    try {
      if (favorites.includes(mealId)) {
        await removeFavorite(user.id, mealId);
        removeFavoriteStore(mealId);
      } else {
        await addFavorite(user.id, mealId);
        addFavoriteStore(mealId);
      }
    } catch (error) {
      console.error('Failed to update favorite:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Meals by Ingredients</h1>
        <p className="text-xl text-muted-foreground">
          Tell us what you have, we'll show you what you can make
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <IngredientInput
          ingredients={ingredients}
          onAdd={addIngredient}
          onRemove={removeIngredient}
          suggestions={suggestions}
        />

        <CategoryFilter
          selected={filters.category}
          onChange={(category) => setFilters({ ...filters, category })}
        />
      </div>

      {isLoading ? (
        <LoadingSkeleton type="grid" count={6} />
      ) : ingredients.length === 0 ? (
        <EmptyState
          icon={<Search size={64} />}
          title="Add ingredients to get started"
          description="Start typing ingredients you have available and we'll find matching recipes"
        />
      ) : matchedMeals.length === 0 ? (
        <EmptyState
          icon={<Search size={64} />}
          title="No matching meals found"
          description="Try adjusting your ingredients or filters"
          action={{
            label: 'Clear ingredients',
            onClick: () => ingredients.forEach(removeIngredient),
          }}
        />
      ) : (
        <div>
          <p className="text-center text-muted-foreground mb-6">
            Found {matchedMeals.length} meal{matchedMeals.length !== 1 ? 's' : ''}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedMeals.map(({ meal, matchPercentage }) => (
              <MealCard
                key={meal.id}
                meal={meal}
                isFavorite={favorites.includes(meal.id)}
                onFavorite={() => handleFavorite(meal.id)}
                onRemoveFavorite={() => handleFavorite(meal.id)}
                onClick={() => setSelectedMeal(meal)}
                showMatchIndicator
                matchPercentage={matchPercentage}
              />
            ))}
          </div>
        </div>
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        isFavorite={selectedMeal ? favorites.includes(selectedMeal.id) : false}
        onFavorite={selectedMeal ? () => handleFavorite(selectedMeal.id) : undefined}
      />
    </div>
  );
};

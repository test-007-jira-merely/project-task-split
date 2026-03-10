import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore, Meal } from '../../stores/useAppStore';
import AnimatedContainer from '../../components/ui/AnimatedContainer';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import MealCard from '../../components/meal/MealCard';
import MealDetailsModal from '../../components/meal/MealDetailsModal';
import CategoryFilter from '../../components/meal/CategoryFilter';
import { IngredientInput } from '../../components/ingredients/IngredientInput';
import { IngredientTag } from '../../components/ingredients/IngredientTag';
import { ChefHat, Search } from 'lucide-react';

type Category = 'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack';

const IngredientsPage = () => {
  const {
    ingredients,
    filteredMeals,
    loading,
    user,
    addIngredient,
    removeIngredient,
    filterByIngredients,
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useAppStore();

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const handleAddIngredient = (ingredient: string) => {
    addIngredient(ingredient);
  };

  const handleRemoveIngredient = (ingredient: string) => {
    removeIngredient(ingredient);
  };

  const handleFindMeals = async () => {
    if (ingredients.length === 0) {
      alert('Please add at least one ingredient to search');
      return;
    }
    await filterByIngredients(ingredients);
  };

  const handleToggleFavorite = async (mealId: string) => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }

    if (isFavorite(mealId)) {
      await removeFavorite(mealId);
    } else {
      await addFavorite(mealId);
    }
  };

  const handleMealClick = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMeal(null);
  };

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
  };

  // Calculate match percentage for each meal
  const calculateMatchPercentage = (meal: Meal): number => {
    if (ingredients.length === 0) return 100;

    const mealIngredientNames = meal.ingredients.map((ing) =>
      ing.ingredient.toLowerCase()
    );
    const matchCount = ingredients.filter((searchIng) =>
      mealIngredientNames.some((mealIng) =>
        mealIng.includes(searchIng.toLowerCase())
      )
    ).length;

    return Math.round((matchCount / ingredients.length) * 100);
  };

  // Filter meals by category
  const filteredByCategory = filteredMeals.filter((meal) => {
    if (activeCategory === 'all') return true;
    return meal.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const convertMealForModal = (meal: Meal | null) => {
    if (!meal) return null;

    return {
      id: meal.id,
      name: meal.name,
      category: meal.category,
      description: meal.instructions.substring(0, 200) + '...',
      image: meal.thumbnail,
      ingredients: meal.ingredients.map(
        (ing) => `${ing.measure} ${ing.ingredient}`
      ),
      instructions: meal.instructions.split(/\r?\n/).filter((line) => line.trim()),
      isFavorite: isFavorite(meal.id),
    };
  };

  const convertMealForCard = (meal: Meal) => {
    return {
      id: meal.id,
      name: meal.name,
      category: meal.category,
      description: meal.instructions.substring(0, 150) + '...',
      image: meal.thumbnail,
      ingredientCount: meal.ingredients.length,
      matchPercentage: calculateMatchPercentage(meal),
      isFavorite: isFavorite(meal.id),
    };
  };

  return (
    <AnimatedContainer className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Title and Description */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
            Find Meals by Ingredients
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Enter the ingredients you have and discover recipes you can make
          </p>
        </div>

        {/* Ingredient Input Section */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Ingredients
            </h2>

            <IngredientInput
              onAdd={handleAddIngredient}
              existingIngredients={ingredients}
            />

            {/* Selected Ingredients Display */}
            {ingredients.length > 0 && (
              <div className="mt-4">
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
              </div>
            )}

            {/* Find Meals Button */}
            <button
              onClick={handleFindMeals}
              disabled={loading || ingredients.length === 0}
              className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              {loading ? 'Searching...' : 'Find Meals'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {filteredMeals.length > 0 && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex justify-center">
              <CategoryFilter
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>

            {/* Meals Grid */}
            {filteredByCategory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredByCategory.map((meal) => (
                  <MealCard
                    key={meal.id}
                    {...convertMealForCard(meal)}
                    onToggleFavorite={handleToggleFavorite}
                    onClick={() => handleMealClick(meal)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<ChefHat className="w-16 h-16" />}
                title="No meals in this category"
                description="Try selecting a different category or adjusting your ingredients"
              />
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton type="card" count={6} />
          </div>
        )}

        {/* Empty State - No Ingredients */}
        {!loading && ingredients.length === 0 && filteredMeals.length === 0 && (
          <EmptyState
            icon={<ChefHat className="w-16 h-16" />}
            title="No ingredients selected"
            description="Add some ingredients above to find delicious meals you can make!"
          />
        )}

        {/* Empty State - No Results */}
        {!loading &&
          ingredients.length > 0 &&
          filteredMeals.length === 0 && (
            <EmptyState
              icon={<Search className="w-16 h-16" />}
              title="No meals found"
              description="We couldn't find any meals with those ingredients. Try adjusting your selection!"
            />
          )}

        {/* Meal Details Modal */}
        <MealDetailsModal
          meal={convertMealForModal(selectedMeal)}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
    </AnimatedContainer>
  );
};

export default IngredientsPage;

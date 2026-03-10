import { useState } from 'react';
import { useAppStore, Meal } from '../../stores/useAppStore';
import AnimatedContainer from '../../components/ui/AnimatedContainer';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import MealCard from '../../components/meal/MealCard';
import MealDetailsModal from '../../components/meal/MealDetailsModal';
import { Sparkles } from 'lucide-react';

const HomePage = () => {
  const {
    currentMeal,
    loading,
    user,
    generateRandomMeal,
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useAppStore();

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateMeal = async () => {
    await generateRandomMeal();
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
      matchPercentage: 100,
      isFavorite: isFavorite(meal.id),
    };
  };

  return (
    <AnimatedContainer className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
            Discover Your Next Meal
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Let us surprise you with a delicious recipe
          </p>

          {/* Generate Meal Button */}
          <button
            onClick={handleGenerateMeal}
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 mx-auto"
          >
            <Sparkles className="w-6 h-6" />
            {loading ? 'Generating...' : 'Generate Random Meal'}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="max-w-2xl mx-auto">
            <LoadingSkeleton type="card" count={1} />
          </div>
        )}

        {/* Current Meal Display */}
        {!loading && currentMeal && (
          <div className="max-w-2xl mx-auto">
            <MealCard
              {...convertMealForCard(currentMeal)}
              onToggleFavorite={handleToggleFavorite}
              onClick={() => handleMealClick(currentMeal)}
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && !currentMeal && (
          <EmptyState
            icon={<Sparkles className="w-16 h-16" />}
            title="No meal generated yet"
            description="Click the button above to generate a random meal and discover something delicious!"
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

export default HomePage;

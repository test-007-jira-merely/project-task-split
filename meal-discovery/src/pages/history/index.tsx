import { useState } from 'react';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { AnimatedContainer } from '@/components/AnimatedContainer';
import { EmptyState } from '@/components/EmptyState';
import { useMeals } from '@/hooks/useMeals';
import { useHistory } from '@/hooks/useHistory';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { getMealsByIds } from '@/utils/mealGenerator';
import { Meal } from '@/types';
import { Clock } from 'lucide-react';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: meals, isLoading: mealsLoading } = useMeals();
  const { history, isLoading: historyLoading } = useHistory();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  if (!user) {
    return (
      <EmptyState
        icon={<Clock className="w-16 h-16" />}
        title="Sign in to view history"
        description="Create an account to track your meal history"
        action={{
          label: 'Sign In',
          onClick: () => navigate('/auth/login'),
        }}
      />
    );
  }

  if (mealsLoading || historyLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LoadingSkeleton type="card" count={6} />
      </div>
    );
  }

  const historyMeals = meals ? getMealsByIds(meals, history) : [];

  const handleToggleFavorite = (mealId: string) => {
    if (isFavorite(mealId)) {
      removeFavorite(mealId);
    } else {
      addFavorite(mealId);
    }
  };

  return (
    <div>
      <AnimatedContainer animation="fade">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Meal History</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Recently generated meals
          </p>
        </div>

        {historyMeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyMeals.map((meal, index) => (
              <AnimatedContainer key={meal.id} animation="slide" delay={index * 0.05}>
                <MealCard
                  meal={meal}
                  onFavorite={handleToggleFavorite}
                  onViewDetails={setSelectedMeal}
                  isFavorite={isFavorite(meal.id)}
                  showActions
                />
              </AnimatedContainer>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Clock className="w-16 h-16" />}
            title="No history yet"
            description="Generate meals to see them appear here"
            action={{
              label: 'Generate Meal',
              onClick: () => navigate('/'),
            }}
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

export default History;

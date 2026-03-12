import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { MealCard } from '../components/meal/MealCard';
import { MealDetailsModal } from '../components/meal/MealDetailsModal';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/Loading';
import { useAppStore } from '../stores/useAppStore';
import { mealService, historyService } from '../services/mealService';
import type { Meal } from '../types/database';

const HistoryPageContent = () => {
  const { user, setHistory } = useAppStore();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const historyIds = await historyService.getUserHistory(user.id);
        setHistory(historyIds);

        // Get unique meal IDs
        const uniqueIds = Array.from(new Set(historyIds));
        const mealPromises = uniqueIds.map((id) => mealService.getMealById(id));
        const mealsData = await Promise.all(mealPromises);

        // Sort by order in history
        const sortedMeals = historyIds
          .map((id) => mealsData.find((m) => m?.id === id))
          .filter((m) => m !== null && m !== undefined) as Meal[];

        // Remove duplicates while preserving order
        const uniqueMeals = Array.from(
          new Map(sortedMeals.map((meal) => [meal.id, meal])).values()
        );

        setMeals(uniqueMeals);
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [user, setHistory]);

  const handleViewDetails = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Meal History
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Recently generated and viewed meals
          </p>
        </div>

        {meals.length === 0 ? (
          <EmptyState
            icon={<Clock className="h-16 w-16" />}
            title="No history yet"
            description="Generate some meals to see your history!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} onView={() => handleViewDetails(meal)} />
            ))}
          </div>
        )}

        <MealDetailsModal
          meal={selectedMeal}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </AppLayout>
  );
};

export const HistoryPage = () => {
  return (
    <ProtectedRoute>
      <HistoryPageContent />
    </ProtectedRoute>
  );
};

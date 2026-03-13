import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { History } from 'lucide-react';
import { MealCard } from '@/components/meal/MealCard';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { mealService } from '@/services/mealService';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { Meal } from '@/types/meal';

export function HistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['history', user?.id],
    queryFn: () => user ? mealService.getHistory(user.id) : Promise.resolve([]),
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmptyState
          icon={History}
          title="Login required"
          description="Please login to view your meal history"
          action={
            <Button onClick={() => navigate('/auth/login')}>
              Login
            </Button>
          }
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Your Meal History
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Recently generated and viewed meals
        </p>
      </div>

      {history.length === 0 ? (
        <EmptyState
          icon={History}
          title="No history yet"
          description="Start generating meals to build your history"
          action={
            <Button onClick={() => navigate('/')}>
              Generate Meals
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((meal, index) => (
            <MealCard
              key={`${meal.id}-${index}`}
              meal={meal}
              onView={setSelectedMeal}
            />
          ))}
        </div>
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />
    </div>
  );
}

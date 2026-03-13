import { useState } from 'react';
import { History as HistoryIcon } from 'lucide-react';
import { useHistoryTracker } from '@features/history/useHistoryTracker';
import { MealCard } from '@components/meal/MealCard';
import { MealDetailsModal } from '@components/meal/MealDetailsModal';
import { EmptyState } from '@components/ui/EmptyState';
import { LoadingSkeleton } from '@components/ui/LoadingSkeleton';
import { useAuth } from '@hooks/useAuth';
import type { Meal } from '@types/meal';
import { Button } from '@components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function History() {
  const { isAuthenticated } = useAuth();
  const { history, isLoading } = useHistoryTracker();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        <EmptyState
          icon={<HistoryIcon className="w-16 h-16" />}
          title="Sign in to view history"
          description="Create an account to track your meal generation history"
          action={<Button onClick={() => navigate('/login')}>Sign In</Button>}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">Meal History</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton count={6} className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Meal History</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Recently generated meals
        </p>
      </div>

      {history.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((meal) => (
            <MealCard key={meal.id} meal={meal} onClick={() => setSelectedMeal(meal)} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<HistoryIcon className="w-16 h-16" />}
          title="No history yet"
          description="Generate some meals to see them here"
        />
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />
    </div>
  );
}

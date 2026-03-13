import { useState } from 'react';
import { History as HistoryIcon, Clock } from 'lucide-react';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { MealDetailsModal } from '@/components/meal/MealDetailsModal';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useHistory } from '@/features/history/useHistory';
import { useFavorites } from '@/features/favorites/useFavorites';
import { Meal } from '@/types/meal';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const History = () => {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const { history, isLoading } = useHistory();
  const { isFavorited, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} height="120px" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatedContainer>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Meal History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {history.length} recently generated {history.length === 1 ? 'meal' : 'meals'}
          </p>
        </div>
      </AnimatedContainer>

      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map(({ meal, generatedAt }) => (
            <Card
              key={`${meal.id}-${generatedAt}`}
              hover
              className="cursor-pointer"
              onClick={() => setSelectedMeal(meal)}
            >
              <div className="flex gap-4">
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  className="w-32 h-32 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                      {meal.name}
                    </h3>
                    <Badge variant="secondary" size="sm">
                      {meal.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {meal.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Generated {formatDate(generatedAt)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={HistoryIcon}
          title="No history yet"
          description="Your generated meals will appear here"
          action={
            <Button onClick={() => navigate('/')}>
              Generate a Meal
            </Button>
          }
        />
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onFavorite={selectedMeal ? () => toggleFavorite(selectedMeal.id) : undefined}
        isFavorited={selectedMeal ? isFavorited(selectedMeal.id) : false}
      />
    </div>
  );
};

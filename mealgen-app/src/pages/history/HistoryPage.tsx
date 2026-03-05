import { useState } from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Clock } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import MealCard from '@/components/meal/MealCard';
import MealDetailsModal from '@/components/meal/MealDetailsModal';
import { useHistory } from '@/features/history/useHistory';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useAppStore } from '@/stores/useAppStore';
import type { MealWithMatch } from '@/types';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const { groupedHistory, isLoading } = useHistory();
  const { isFavorite, addToFavorites, removeFromFavorites, getFavoriteId } = useFavorites();
  const { meals } = useAppStore();
  const [selectedMeal, setSelectedMeal] = useState<MealWithMatch | null>(null);
  const navigate = useNavigate();

  const handleFavoriteToggle = (mealId: string) => {
    if (isFavorite(mealId)) {
      const favoriteId = getFavoriteId(mealId);
      if (favoriteId) removeFromFavorites(favoriteId);
    } else {
      addToFavorites(mealId);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
      </div>
    );
  }

  const hasHistory = Object.keys(groupedHistory).length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Generation History
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your recently generated meals
        </p>
      </div>

      {hasHistory ? (
        <div className="space-y-8">
          {Object.entries(groupedHistory).map(([groupKey, entries]) => (
            <motion.div
              key={groupKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-500" />
                {groupKey}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entries.map((entry) => {
                  const meal = meals.find((m) => m.id === entry.meal_id);
                  if (!meal) return null;

                  return (
                    <MealCard
                      key={entry.id}
                      meal={meal}
                      onClick={() => setSelectedMeal(meal)}
                      onFavoriteToggle={() => handleFavoriteToggle(meal.id)}
                      isFavorite={isFavorite(meal.id)}
                    />
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<HistoryIcon className="w-16 h-16" />}
          title="No history yet"
          description="Generate meals from the home page to see them here"
          action={{
            label: "Generate Meal",
            onClick: () => navigate('/'),
          }}
        />
      )}

      {/* Meal Details Modal */}
      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onFavoriteToggle={
          selectedMeal ? () => handleFavoriteToggle(selectedMeal.id) : undefined
        }
        isFavorite={selectedMeal ? isFavorite(selectedMeal.id) : false}
      />
    </div>
  );
}

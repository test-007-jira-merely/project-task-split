import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { EmptyState, LoadingSkeleton } from '@/components/ui';
import { MealDetailsModal } from '@/components/meal';
import { useHistory } from '@/features/history/useHistory';
import { useFavorites } from '@/features/favorites/useFavorites';
import { Meal } from '@/types';
import mealsData from '@/data/meals.json';

const HistoryPage: React.FC = () => {
  const { history, isLoading } = useHistory();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const meals = mealsData as Meal[];
  const historyMeals = history.map(h => ({
    meal: meals.find(m => m.id === h.meal_id)!,
    timestamp: h.generated_at,
  })).filter(h => h.meal);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-foreground">History</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <LoadingSkeleton key={i} variant="card" height="120px" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">History</h1>
        <p className="text-muted-foreground">
          Your recently generated meals
        </p>
      </div>

      {historyMeals.length === 0 ? (
        <EmptyState
          icon={<Clock className="h-16 w-16" />}
          title="No history yet"
          description="Generate some meals to see your history here"
        />
      ) : (
        <div className="space-y-4">
          {historyMeals.map((item, index) => (
            <motion.div
              key={`${item.meal.id}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-2xl p-4 shadow-glass flex items-center space-x-4 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedMeal(item.meal)}
            >
              <img
                src={item.meal.imageUrl}
                alt={item.meal.name}
                className="h-20 w-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{item.meal.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(item.timestamp), 'MMM dd, yyyy • h:mm a')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onFavorite={toggleFavorite}
        isFavorite={selectedMeal ? isFavorite(selectedMeal.id) : false}
      />
    </div>
  );
};

export default HistoryPage;

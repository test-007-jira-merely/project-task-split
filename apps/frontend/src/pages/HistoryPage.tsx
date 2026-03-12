import { History } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import { useDishStore } from '../stores/dish.store';
import DishCard from '../components/dish/DishCard';

export default function HistoryPage() {
  const { dishHistory } = useDishStore();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Your History</h1>
        <p className="text-text-secondary">
          Recently viewed recipes ({dishHistory.length})
        </p>
      </div>

      {dishHistory.length === 0 ? (
        <EmptyState
          icon={History}
          title="No history yet"
          description="Your recently viewed recipes will appear here"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dishHistory.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
}

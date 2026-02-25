import { AppLayout } from '@/components/layout/AppLayout';
import { DishCard } from '@/components/dish/DishCard';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/Button';
import { useDishStore } from '@/stores/dish-store';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';

export function HistoryPage() {
  const { dishHistory, clearHistory } = useDishStore();
  const navigate = useNavigate();

  // Reverse to show newest first
  const sortedHistory = [...dishHistory].reverse();

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Your History</h1>
            <p className="text-muted-foreground">
              {dishHistory.length} {dishHistory.length === 1 ? 'dish' : 'dishes'} viewed
            </p>
          </div>
          {dishHistory.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={clearHistory}
              className="flex items-center gap-2"
            >
              <FiTrash2 className="w-4 h-4" />
              Clear History
            </Button>
          )}
        </div>

        {dishHistory.length === 0 ? (
          <EmptyState
            title="No history yet"
            description="Dishes you generate will appear here"
            icon="📜"
            action={{
              label: 'Generate a Meal',
              onClick: () => navigate('/'),
            }}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedHistory.map((dish, index) => (
              <motion.div
                key={`${dish.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DishCard dish={dish} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}

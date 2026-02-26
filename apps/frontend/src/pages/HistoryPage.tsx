import { motion } from 'framer-motion';
import { History as HistoryIcon, Trash2 } from 'lucide-react';
import { DishCard } from '@/components/DishCard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useHistory, useClearHistory } from '@/hooks/useHistory';

export function HistoryPage() {
  const { data: history, isLoading } = useHistory();
  const clearHistory = useClearHistory();

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your viewing history?')) {
      clearHistory.mutate();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-3">
            <HistoryIcon className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Viewing History</h1>
          </div>
          {history && history.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearHistory}
              isLoading={clearHistory.isPending}
            >
              <Trash2 className="h-4 w-4" />
              Clear History
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">
          Recently viewed recipes
        </p>
      </motion.div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      )}

      {history && history.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {history.map((entry: any) => (
            <DishCard key={entry.id} dish={entry.dish} />
          ))}
        </motion.div>
      )}

      {history && history.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">📜</div>
          <h3 className="text-2xl font-semibold mb-2">No history yet</h3>
          <p className="text-muted-foreground">
            Your recently viewed recipes will appear here
          </p>
        </motion.div>
      )}
    </div>
  );
}

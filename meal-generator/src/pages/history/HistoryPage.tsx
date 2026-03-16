import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useHistory } from '../../hooks/useHistory';
import { MealCard } from '../../components/meal/MealCard';
import { MealDetailsModal } from '../../components/meal/MealDetailsModal';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { history, isLoading } = useHistory();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
          Meal History
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Recently generated and viewed meals
        </p>
      </motion.div>

      {history.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No History Yet"
          description="Your generated meals will appear here. Start discovering new recipes!"
          action={
            <Button onClick={() => navigate('/')} variant="primary">
              Generate Meals
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {history.map((item: any) => (
            <MealCard
              key={item.id}
              meal={item.meals}
              onViewDetails={() => {
                setSelectedMeal(item.meals);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default HistoryPage;

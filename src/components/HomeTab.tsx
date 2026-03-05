import { AnimatePresence } from 'framer-motion';
import { useMealStore } from '../store/useMealStore';
import HeroSection from './HeroSection';
import DishCard from './DishCard';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';

export default function HomeTab() {
  const { currentDish, loading } = useMealStore();

  return (
    <div className="space-y-8">
      <HeroSection />

      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingState key="loading" />
        ) : currentDish ? (
          <DishCard key={currentDish.id} meal={currentDish} />
        ) : (
          <EmptyState
            key="empty"
            message="Click the button above to discover a delicious meal!"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

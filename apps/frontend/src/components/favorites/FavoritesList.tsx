import { motion } from 'framer-motion';
import type { Dish } from '@meal-platform/shared';
import { DishCard } from '../dish/DishCard';

interface FavoritesListProps {
  dishes: Dish[];
  onViewDetails?: (dish: Dish) => void;
}

export function FavoritesList({ dishes, onViewDetails }: FavoritesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dishes.map((dish, index) => (
        <motion.div
          key={dish.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <DishCard
            dish={dish}
            onViewDetails={() => onViewDetails?.(dish)}
          />
        </motion.div>
      ))}
    </div>
  );
}

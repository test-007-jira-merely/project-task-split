import { motion, AnimatePresence } from 'framer-motion';
import { Tag } from '../ui/Tag';

interface IngredientTagListProps {
  ingredients: string[];
  onRemove: (ingredient: string) => void;
}

export const IngredientTagList = ({ ingredients, onRemove }: IngredientTagListProps) => {
  if (ingredients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No ingredients added yet
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <AnimatePresence>
        {ingredients.map((ingredient) => (
          <motion.div
            key={ingredient}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Tag
              label={ingredient}
              onRemove={() => onRemove(ingredient)}
              variant="primary"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

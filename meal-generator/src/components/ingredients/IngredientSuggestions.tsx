import { motion } from 'framer-motion';

interface IngredientSuggestionsProps {
  suggestions: string[];
  onSelect: (ingredient: string) => void;
}

export const IngredientSuggestions = ({ suggestions, onSelect }: IngredientSuggestionsProps) => {
  if (suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4"
    >
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Popular ingredients:
      </h4>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((ingredient) => (
          <button
            key={ingredient}
            onClick={() => onSelect(ingredient)}
            className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-sm hover:bg-primary-50 dark:hover:bg-primary-900 hover:border-primary-500 transition-colors"
          >
            {ingredient}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

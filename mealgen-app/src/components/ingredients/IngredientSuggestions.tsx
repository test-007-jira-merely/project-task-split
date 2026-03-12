import { motion, AnimatePresence } from 'framer-motion';

interface IngredientSuggestionsProps {
  suggestions: string[];
  onSelect: (ingredient: string) => void;
}

export default function IngredientSuggestions({
  suggestions,
  onSelect,
}: IngredientSuggestionsProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
      >
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
          >
            {suggestion}
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

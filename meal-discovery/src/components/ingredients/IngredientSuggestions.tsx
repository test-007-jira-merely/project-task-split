import { IngredientSuggestionsProps } from '@/types/components';
import { motion, AnimatePresence } from 'framer-motion';

export const IngredientSuggestions = ({
  suggestions,
  onSelect,
  searchTerm
}: IngredientSuggestionsProps) => {
  const filtered = suggestions
    .filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 10);

  if (filtered.length === 0 || !searchTerm) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute z-10 w-full mt-1 bg-card rounded-xl shadow-lg border border-border max-h-60 overflow-y-auto"
      >
        {filtered.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
          >
            {suggestion}
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

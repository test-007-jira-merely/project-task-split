import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface IngredientAutocompleteProps {
  suggestions: string[];
  onSelect: (ingredient: string) => void;
}

export function IngredientAutocomplete({ suggestions, onSelect }: IngredientAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen || suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="absolute z-10 w-full mt-2 bg-card-bg border border-border rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        <ul className="max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <motion.li
              key={suggestion}
              className="px-4 py-3 hover:bg-card-hover cursor-pointer transition-colors capitalize"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                onSelect(suggestion);
                setIsOpen(false);
              }}
            >
              {suggestion}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
}

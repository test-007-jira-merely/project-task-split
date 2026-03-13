import { motion } from 'framer-motion';

interface IngredientSuggestionsProps {
  suggestions: string[];
  onSelect: (ingredient: string) => void;
}

const commonIngredients = [
  'Chicken',
  'Beef',
  'Pork',
  'Fish',
  'Rice',
  'Pasta',
  'Tomatoes',
  'Onions',
  'Garlic',
  'Potatoes',
  'Carrots',
  'Broccoli',
  'Cheese',
  'Eggs',
  'Milk',
  'Flour',
  'Olive Oil',
  'Salt',
  'Pepper',
  'Basil',
];

export function IngredientSuggestions({ suggestions, onSelect }: IngredientSuggestionsProps) {
  const displaySuggestions = suggestions.length > 0 ? suggestions : commonIngredients;

  return (
    <div>
      <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
        {suggestions.length > 0 ? 'Suggestions' : 'Popular Ingredients'}
      </h4>
      <div className="flex flex-wrap gap-2">
        {displaySuggestions.map((ingredient) => (
          <motion.button
            key={ingredient}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(ingredient)}
            className="px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm transition-theme"
          >
            {ingredient}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

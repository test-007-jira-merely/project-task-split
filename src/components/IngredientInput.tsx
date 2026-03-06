import { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMealStore } from '../store/useMealStore';
import { IngredientTag } from './IngredientTag';

export const IngredientInput = () => {
  const [inputValue, setInputValue] = useState('');
  const { ingredients, addIngredient, removeIngredient, clearIngredients } = useMealStore();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addIngredient(inputValue);
      setInputValue('');
    }
  };

  const handleAddClick = () => {
    if (inputValue.trim()) {
      addIngredient(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Input field */}
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type an ingredient and press Enter..."
            className="w-full px-4 py-3 bg-surface-light dark:bg-surface-dark border-2 border-border-light dark:border-border-dark rounded-2xl focus:outline-none focus:border-primary-light dark:focus:border-primary-dark transition-colors text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light dark:placeholder-text-secondary-dark"
          />
        </div>
        <motion.button
          onClick={handleAddClick}
          disabled={!inputValue.trim()}
          className="px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-2xl font-medium hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add
        </motion.button>
      </div>

      {/* Tags */}
      {ingredients.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
              Your ingredients ({ingredients.length})
            </span>
            <motion.button
              onClick={clearIngredients}
              className="text-sm text-red-500 hover:text-red-600 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear all
            </motion.button>
          </div>

          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {ingredients.map((ingredient) => (
                <IngredientTag
                  key={ingredient}
                  ingredient={ingredient}
                  onRemove={() => removeIngredient(ingredient)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

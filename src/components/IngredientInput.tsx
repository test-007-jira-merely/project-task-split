import { useState, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { useMealStore } from '../store/useMealStore';
import IngredientTag from './IngredientTag';

export default function IngredientInput() {
  const [inputValue, setInputValue] = useState('');
  const { ingredients, addIngredient, removeIngredient, clearIngredients } = useMealStore();

  const handleAddIngredient = () => {
    if (inputValue.trim()) {
      addIngredient(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddIngredient();
    }
  };

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter an ingredient (e.g., chicken, tomato)"
          className="input-field flex-1"
        />
        <motion.button
          onClick={handleAddIngredient}
          className="btn-primary px-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add
        </motion.button>
      </div>

      {/* Tags Section */}
      {ingredients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Your ingredients ({ingredients.length})
            </p>
            <motion.button
              onClick={clearIngredients}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear All
            </motion.button>
          </div>

          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <IngredientTag
                key={index}
                ingredient={ingredient}
                onRemove={() => removeIngredient(ingredient)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

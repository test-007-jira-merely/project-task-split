import { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIngredientStore } from '../../stores/ingredient.store';

export default function IngredientInput() {
  const { ingredients, addIngredient, removeIngredient, clearIngredients } = useIngredientStore();
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      addIngredient(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Ingredients</h2>
        {ingredients.length > 0 && (
          <button
            onClick={clearIngredients}
            className="text-sm text-text-secondary hover:text-primary-600 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., chicken, garlic, olive oil"
          className="input flex-1"
        />
        <button
          onClick={handleAdd}
          className="btn-primary flex-shrink-0"
          disabled={!input.trim()}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Ingredient Tags */}
      <div className="flex flex-wrap gap-2 min-h-[2rem]">
        <AnimatePresence mode="popLayout">
          {ingredients.map((ingredient) => (
            <motion.div
              key={ingredient}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium"
            >
              <span className="capitalize">{ingredient}</span>
              <button
                onClick={() => removeIngredient(ingredient)}
                className="hover:bg-primary-200 dark:hover:bg-primary-800/50 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {ingredients.length === 0 && (
          <p className="text-sm text-text-tertiary italic">
            Add ingredients to find matching recipes
          </p>
        )}
      </div>

      {ingredients.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-text-secondary">
            <span className="font-medium">{ingredients.length}</span> ingredient{ingredients.length !== 1 ? 's' : ''} added
          </p>
        </div>
      )}
    </div>
  );
}

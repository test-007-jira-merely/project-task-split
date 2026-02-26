import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { IngredientTag } from './IngredientTag';

interface IngredientEngineProps {
  ingredients: string[];
  onAdd: (ingredient: string) => void;
  onRemove: (ingredient: string) => void;
  onSearch: () => void;
  isSearching?: boolean;
}

export function IngredientEngine({
  ingredients,
  onAdd,
  onRemove,
  onSearch,
  isSearching,
}: IngredientEngineProps) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim().toLowerCase());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="card space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold">Find Dishes by Ingredients</h3>
        <p className="text-muted">Add ingredients you have and discover matching recipes</p>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., chicken, rice, tomato"
          className="flex-1 px-4 py-3 rounded-lg border border-border bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
        <motion.button
          onClick={handleAdd}
          className="btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!input.trim()}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Ingredient tags */}
      {ingredients.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence>
            {ingredients.map((ingredient) => (
              <IngredientTag
                key={ingredient}
                ingredient={ingredient}
                onRemove={() => onRemove(ingredient)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Search button */}
      {ingredients.length > 0 && (
        <motion.button
          onClick={onSearch}
          className="w-full btn-primary flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          disabled={isSearching}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Search className="w-5 h-5" />
          {isSearching ? 'Searching...' : `Find Dishes (${ingredients.length} ingredients)`}
        </motion.button>
      )}
    </div>
  );
}

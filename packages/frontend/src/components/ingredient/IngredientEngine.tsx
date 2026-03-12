import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { IngredientTag } from './IngredientTag';
import { useIngredientStore } from '@/stores/ingredient-store';
import { useIngredientMatch } from '@/hooks/useIngredientMatch';
import { FiSearch, FiX } from 'react-icons/fi';

export function IngredientEngine() {
  const [input, setInput] = useState('');
  const { selectedIngredients, addIngredient, removeIngredient, clearIngredients } = useIngredientStore();
  const matchMutation = useIngredientMatch();

  const handleAddIngredient = () => {
    if (input.trim()) {
      addIngredient(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleSearch = () => {
    if (selectedIngredients.length > 0) {
      matchMutation.mutate({
        ingredients: selectedIngredients,
        allowSubstitutions: true,
        minCoverage: 50,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Enter an ingredient (e.g., tomato, onion)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
          />
        </div>
        <Button onClick={handleAddIngredient} variant="primary">
          Add
        </Button>
      </div>

      {/* Selected Ingredients */}
      {selectedIngredients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? 's' : ''} selected
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearIngredients}
              className="text-muted-foreground"
            >
              <FiX className="w-4 h-4 mr-1" />
              Clear all
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selectedIngredients.map((ingredient) => (
                <IngredientTag
                  key={ingredient}
                  ingredient={ingredient}
                  onRemove={removeIngredient}
                />
              ))}
            </AnimatePresence>
          </div>

          <Button
            onClick={handleSearch}
            variant="primary"
            size="lg"
            className="w-full"
            disabled={matchMutation.isPending}
          >
            {matchMutation.isPending ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Searching...
              </>
            ) : (
              <>
                <FiSearch className="w-5 h-5 mr-2" />
                Find Matching Dishes
              </>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Search } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useAppStore } from '@/stores/useAppStore';
import { useIngredientMatching } from '@/hooks/useMatching';
import { cn } from '@/lib/utils';

const SUGGESTED_INGREDIENTS = [
  'chicken', 'rice', 'tomato', 'onion', 'garlic', 'pasta',
  'cheese', 'eggs', 'milk', 'bread', 'potato', 'carrot',
  'bell pepper', 'broccoli', 'spinach', 'ground beef',
];

export function IngredientEngine() {
  const [inputValue, setInputValue] = useState('');
  const userIngredients = useAppStore((state) => state.userIngredients);
  const addIngredient = useAppStore((state) => state.addIngredient);
  const removeIngredient = useAppStore((state) => state.removeIngredient);
  const clearIngredients = useAppStore((state) => state.clearIngredients);

  const matchingMutation = useIngredientMatching();

  const handleAddIngredient = (ingredient: string) => {
    const normalized = ingredient.trim().toLowerCase();
    if (normalized && !userIngredients.includes(normalized)) {
      addIngredient(normalized);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleAddIngredient(inputValue);
    }
  };

  const handleSearch = () => {
    if (userIngredients.length > 0) {
      matchingMutation.mutate({
        ingredients: userIngredients,
        allowSubstitutes: true,
        maxResults: 10,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6 border border-border"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Ingredient Matcher</h3>
          {userIngredients.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearIngredients}
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type an ingredient..."
              className="pr-10"
            />
            <button
              onClick={() => handleAddIngredient(inputValue)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-accent transition-colors"
              disabled={!inputValue.trim()}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <Button
            onClick={handleSearch}
            disabled={userIngredients.length === 0 || matchingMutation.isPending}
            isLoading={matchingMutation.isPending}
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Find Matches</span>
          </Button>
        </div>

        {/* Selected Ingredients */}
        {userIngredients.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Selected ingredients ({userIngredients.length})
            </p>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {userIngredients.map((ingredient) => (
                  <motion.div
                    key={ingredient}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge
                      className="pr-1 gap-1 cursor-pointer hover:bg-primary/90"
                      onClick={() => removeIngredient(ingredient)}
                    >
                      {ingredient}
                      <X className="h-3 w-3" />
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Suggestions */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Quick add</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_INGREDIENTS.filter(
              (ing) => !userIngredients.includes(ing)
            )
              .slice(0, 8)
              .map((ingredient) => (
                <motion.button
                  key={ingredient}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddIngredient(ingredient)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium',
                    'bg-secondary hover:bg-accent transition-colors'
                  )}
                >
                  + {ingredient}
                </motion.button>
              ))}
          </div>
        </div>

        {/* Error State */}
        {matchingMutation.isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
          >
            {matchingMutation.error.message || 'Failed to find matches'}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import type { IngredientInputProps } from '@/types/components';

export function IngredientInput({
  value,
  onChange,
  onAdd,
  suggestions,
  placeholder = 'Add ingredient...',
}: IngredientInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setShowSuggestions(value.length >= 2 && suggestions.length > 0);
  }, [value, suggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim());
      onChange('');
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onAdd(suggestion);
    onChange('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => value.length >= 2 && setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
          />

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 glass-card max-h-60 overflow-y-auto z-10"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-gray-100 first:rounded-t-xl last:rounded-b-xl"
                  >
                    {suggestion}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          type="submit"
          className="px-4 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PlusIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Add</span>
        </motion.button>
      </form>
    </div>
  );
}

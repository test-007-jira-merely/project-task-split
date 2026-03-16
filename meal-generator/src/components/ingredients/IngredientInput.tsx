import { useState, KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

interface IngredientInputProps {
  onAdd: (ingredient: string) => void;
  suggestions?: string[];
}

export const IngredientInput = ({ onAdd, suggestions = [] }: IngredientInputProps) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(input.toLowerCase())
  ).slice(0, 5);

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim());
      setInput('');
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Add an ingredient..."
          className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 outline-none transition-all"
        />
        <Button onClick={handleAdd} variant="primary" disabled={!input.trim()}>
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                onAdd(suggestion);
                setInput('');
                setShowSuggestions(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

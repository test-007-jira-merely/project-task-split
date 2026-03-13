import { useState, KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { normalizeIngredient } from '@/utils/normalization';

interface IngredientInputProps {
  onAdd: (ingredient: string) => void;
  suggestions?: string[];
}

export const IngredientInput = ({ onAdd, suggestions = [] }: IngredientInputProps) => {
  const [value, setValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter((suggestion) =>
    normalizeIngredient(suggestion).includes(normalizeIngredient(value))
  ).slice(0, 5);

  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
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
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type an ingredient..."
            onFocus={() => setShowSuggestions(true)}
          />
        </div>
        <Button onClick={handleAdd} disabled={!value.trim()}>
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && value.trim() && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                onAdd(suggestion);
                setValue('');
                setShowSuggestions(false);
              }}
              className="
                w-full px-4 py-2.5 text-left
                hover:bg-gray-100 dark:hover:bg-gray-700
                text-gray-900 dark:text-white
                transition-colors
              "
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

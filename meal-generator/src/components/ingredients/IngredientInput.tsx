import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface IngredientInputProps {
  onAdd: (ingredient: string) => void;
  suggestions?: string[];
}

export const IngredientInput = ({ onAdd, suggestions = [] }: IngredientInputProps) => {
  const [value, setValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(value.toLowerCase())
  ).slice(0, 5);

  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={value}
            onChange={(v) => {
              setValue(v);
              setShowSuggestions(true);
            }}
            placeholder="Type an ingredient..."
          />
        </div>
        <Button onClick={handleAdd} disabled={!value.trim()}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && value && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                onAdd(suggestion);
                setValue('');
                setShowSuggestions(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

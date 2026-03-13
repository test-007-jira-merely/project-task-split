import { useState, KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import { Input, Button } from '../ui';

interface IngredientInputProps {
  onAdd: (ingredient: string) => void;
  suggestions?: string[];
}

export function IngredientInput({ onAdd, suggestions = [] }: IngredientInputProps) {
  const [value, setValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(s =>
    s.toLowerCase().includes(value.toLowerCase())
  ).slice(0, 5);

  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onAdd(suggestion);
    setValue('');
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(value.length > 0)}
            placeholder="Type an ingredient..."
            className="w-full"
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        <Button onClick={handleAdd} size="md">
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

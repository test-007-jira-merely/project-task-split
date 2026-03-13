import { useState, KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface IngredientInputProps {
  onAdd: (ingredient: string) => void;
  suggestions?: string[];
}

export function IngredientInput({ onAdd, suggestions = [] }: IngredientInputProps) {
  const [value, setValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(value.toLowerCase())
  );

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
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyPress={handleKeyPress}
          placeholder="Type an ingredient..."
          className="flex-1"
        />
        <Button onClick={handleAdd} disabled={!value.trim()}>
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && value && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 first:rounded-t-2xl last:rounded-b-2xl"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import type { KeyboardEvent } from 'react';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface IngredientInputProps {
  onAdd: (ingredient: string) => void;
  suggestions?: string[];
}

export function IngredientInput({ onAdd, suggestions = [] }: IngredientInputProps) {
  const [value, setValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions
    .filter(s => s.toLowerCase().includes(value.toLowerCase()))
    .slice(0, 5);

  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onKeyPress={handleKeyPress}
          placeholder="Type an ingredient..."
          className="flex-1"
        />
        <Button onClick={handleAdd} size="md">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 card p-2 z-10">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                onAdd(suggestion);
                setValue('');
                setShowSuggestions(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface IngredientInputProps {
  onAdd: (ingredient: string) => void;
  suggestions?: string[];
}

export function IngredientInput({ onAdd, suggestions = [] }: IngredientInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(input.toLowerCase()) && s.toLowerCase() !== input.toLowerCase()
  ).slice(0, 5);

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim());
      setInput('');
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
      <div className="flex space-x-2">
        <div className="flex-1">
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter an ingredient..."
            onFocus={() => setShowSuggestions(true)}
          />
        </div>
        <Button onClick={handleAdd} disabled={!input.trim()}>
          <Plus size={20} className="mr-2" />
          Add
        </Button>
      </div>

      {/* Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                onAdd(suggestion);
                setInput('');
                setShowSuggestions(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-accent transition-colors capitalize"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

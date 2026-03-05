import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import Input from '../ui/Input';
import IngredientSuggestions from './IngredientSuggestions';

interface IngredientInputProps {
  onAdd: (ingredient: string) => void;
  suggestions?: string[];
}

export default function IngredientInput({ onAdd, suggestions = [] }: IngredientInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = suggestions.filter(s =>
    s.toLowerCase().includes(input.toLowerCase())
  ).slice(0, 10);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdd = (ingredient: string) => {
    if (ingredient.trim()) {
      onAdd(ingredient.trim());
      setInput('');
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd(input);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        ref={inputRef}
        type="text"
        placeholder="Add an ingredient (e.g., chicken, rice, tomatoes)..."
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowSuggestions(true);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        icon={<Search className="w-5 h-5" />}
      />
      {showSuggestions && input && filteredSuggestions.length > 0 && (
        <IngredientSuggestions
          suggestions={filteredSuggestions}
          onSelect={handleAdd}
        />
      )}
    </div>
  );
}

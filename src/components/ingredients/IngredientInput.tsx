import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';

interface IngredientInputProps {
  onAdd: (ingredient: string) => void;
  existingIngredients: string[];
  commonIngredients?: string[];
}

const DEFAULT_COMMON_INGREDIENTS = [
  'tomato', 'onion', 'garlic', 'chicken', 'beef', 'pork', 'fish', 'shrimp',
  'rice', 'pasta', 'potato', 'carrot', 'celery', 'bell pepper', 'mushroom',
  'cheese', 'milk', 'butter', 'eggs', 'flour', 'sugar', 'salt', 'pepper',
  'olive oil', 'soy sauce', 'basil', 'parsley', 'cilantro', 'thyme', 'oregano',
  'lemon', 'lime', 'ginger', 'broccoli', 'spinach', 'lettuce', 'cucumber',
  'bacon', 'sausage', 'ground beef', 'chicken breast', 'salmon', 'tuna',
  'beans', 'chickpeas', 'lentils', 'corn', 'peas', 'green beans', 'zucchini',
  'eggplant', 'avocado', 'tomato sauce', 'cream', 'yogurt', 'parmesan', 'mozzarella',
];

export const IngredientInput = ({
  onAdd,
  existingIngredients,
  commonIngredients = DEFAULT_COMMON_INGREDIENTS,
}: IngredientInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const value = inputValue.toLowerCase();
      const filtered = commonIngredients
        .filter(
          (ingredient) =>
            ingredient.toLowerCase().includes(value) &&
            !existingIngredients.some(
              (existing) => existing.toLowerCase() === ingredient.toLowerCase()
            )
        )
        .slice(0, 5);
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [inputValue, commonIngredients, existingIngredients]);

  const handleAdd = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      onAdd(trimmedValue);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onAdd(suggestion);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Delay hiding to allow suggestion clicks to register
    setTimeout(() => {
      if (
        !dropdownRef.current?.contains(document.activeElement) &&
        document.activeElement !== inputRef.current
      ) {
        setShowSuggestions(false);
      }
    }, 150);
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Add an ingredient..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          aria-label="Add ingredient"
        >
          <Plus size={20} />
          Add
        </button>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSuggestionClick(suggestion);
              }}
              className="w-full text-left px-4 py-2 hover:bg-primary-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

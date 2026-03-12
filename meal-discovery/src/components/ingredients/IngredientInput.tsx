import { useState } from 'react';
import { IngredientInputProps } from '@/types/components';
import { Input } from '../ui/Input';
import { IngredientTag } from './IngredientTag';
import { IngredientSuggestions } from './IngredientSuggestions';
import { Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export const IngredientInput = ({
  value,
  onChange,
  suggestions = [],
  placeholder = 'Add ingredient...'
}: IngredientInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onChange([...value, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemove = (ingredient: string) => {
    onChange(value.filter(i => i !== ingredient));
  };

  const handleSelect = (ingredient: string) => {
    if (!value.includes(ingredient)) {
      onChange([...value, ingredient]);
    }
    setInputValue('');
  };

  return (
    <div>
      <div className="relative">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            placeholder={placeholder}
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <IngredientSuggestions
          suggestions={suggestions}
          onSelect={handleSelect}
          searchTerm={inputValue}
        />
      </div>

      <AnimatePresence>
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {value.map((ingredient) => (
              <IngredientTag
                key={ingredient}
                ingredient={ingredient}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

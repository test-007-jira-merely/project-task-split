import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface IngredientInputProps {
  onAdd: (ingredient: string) => void;
  placeholder?: string;
}

export const IngredientInput = ({
  onAdd,
  placeholder = 'Add ingredient...',
}: IngredientInputProps) => {
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      </div>
      <Button onClick={handleAdd} size="md">
        <Plus className="w-5 h-5" />
      </Button>
    </div>
  );
};

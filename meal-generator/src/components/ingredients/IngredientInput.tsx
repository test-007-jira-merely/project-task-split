import { useState, KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';

interface IngredientInputProps {
  onAdd: (ingredient: string) => void;
}

export function IngredientInput({ onAdd }: IngredientInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add ingredient (e.g., chicken, tomatoes)"
        className="flex-1"
      />
      <Button onClick={handleSubmit} disabled={!value.trim()}>
        <Plus className="w-5 h-5" />
      </Button>
    </div>
  );
}

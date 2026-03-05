// Placeholder IngredientInput component - will be implemented in Subtask 1
import React, { useState } from 'react';

interface IngredientInputProps {
  onAdd: (ingredient: string) => void;
  suggestions: string[];
  placeholder?: string;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ onAdd, placeholder }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded"
      />
    </form>
  );
};

export default IngredientInput;

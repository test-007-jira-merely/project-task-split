// Placeholder IngredientTag component - will be implemented in Subtask 1
import React from 'react';
import { motion } from 'framer-motion';

interface IngredientTagProps {
  ingredient: string;
  onRemove: () => void;
}

const IngredientTag: React.FC<IngredientTagProps> = ({ ingredient, onRemove }) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 rounded-full"
    >
      {ingredient}
      <button onClick={onRemove} type="button">&times;</button>
    </motion.span>
  );
};

export default IngredientTag;

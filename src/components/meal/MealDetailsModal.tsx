// Placeholder MealDetailsModal component - will be implemented in Subtask 1
import React from 'react';
import { Meal } from '@/types';

interface MealDetailsModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  onFavorite?: (mealId: string) => void;
  isFavorite?: boolean;
}

const MealDetailsModal: React.FC<MealDetailsModalProps> = ({ meal, isOpen, onClose }) => {
  if (!isOpen || !meal) return null;
  return (
    <div onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <h2>{meal.name}</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default MealDetailsModal;

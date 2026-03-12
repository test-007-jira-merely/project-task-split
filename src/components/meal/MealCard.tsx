// Placeholder MealCard component - will be implemented in Subtask 1
import React from 'react';
import { MealWithMatch } from '@/types';

interface MealCardProps {
  meal: MealWithMatch;
  onView?: (meal: any) => void;
  onFavorite?: (mealId: string) => void;
  isFavorite?: boolean;
  showMatch?: boolean;
}

const MealCard: React.FC<MealCardProps> = ({ meal, onView }) => {
  return (
    <div onClick={() => onView?.(meal)} className="cursor-pointer p-4 rounded border">
      <h3>{meal.name}</h3>
    </div>
  );
};

export default MealCard;

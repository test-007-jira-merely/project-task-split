import type { MealCategory } from '../../types';

interface CategoryBadgeProps {
  category: MealCategory;
}

export const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const colors = {
    breakfast: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    lunch: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    dinner: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    snack: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[category]}`}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
  );
};

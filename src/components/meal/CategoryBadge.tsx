import { Category } from '@/types/models';
import { Coffee, Salad, UtensilsCrossed, Cookie } from 'lucide-react';

interface CategoryBadgeProps {
  category: Category;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const config = {
    breakfast: { icon: Coffee, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' },
    lunch: { icon: Salad, color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
    dinner: { icon: UtensilsCrossed, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
    snack: { icon: Cookie, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
  };

  const { icon: Icon, color } = config[category];

  return (
    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      <Icon size={16} />
      <span className="capitalize">{category}</span>
    </span>
  );
}

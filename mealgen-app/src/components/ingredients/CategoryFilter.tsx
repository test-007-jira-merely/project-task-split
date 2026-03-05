import { motion } from 'framer-motion';
import type { MealCategory } from '@/types';

interface CategoryFilterProps {
  selected?: MealCategory;
  onChange: (category?: MealCategory) => void;
}

const categories: { value: MealCategory | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = selected === category.value;

        return (
          <motion.button
            key={category.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(category.value)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              isActive
                ? 'bg-teal-600 text-white dark:bg-teal-500'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category.label}
          </motion.button>
        );
      })}
    </div>
  );
}

import { MealCategory } from '@types/meal';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  selected: MealCategory | null;
  onChange: (category: MealCategory | null) => void;
}

const categories: { value: MealCategory | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <motion.button
          key={category.label}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(category.value)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-theme ${
            selected === category.value
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
          }`}
        >
          {category.label}
        </motion.button>
      ))}
    </div>
  );
}

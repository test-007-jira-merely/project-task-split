import { motion } from 'framer-motion';
import { Edit, Trash2, Eye } from 'lucide-react';
import type { Meal } from '../../types';
import { Button } from '../ui/Button';

interface AdminMealTableProps {
  meals: Meal[];
  onEdit: (meal: Meal) => void;
  onDelete: (meal: Meal) => void;
  onView: (meal: Meal) => void;
}

export const AdminMealTable = ({ meals, onEdit, onDelete, onView }: AdminMealTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left p-4 font-semibold">Image</th>
            <th className="text-left p-4 font-semibold">Name</th>
            <th className="text-left p-4 font-semibold">Category</th>
            <th className="text-left p-4 font-semibold">Ingredients</th>
            <th className="text-left p-4 font-semibold">Difficulty</th>
            <th className="text-right p-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {meals.map((meal) => (
            <motion.tr
              key={meal.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="p-4">
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              </td>
              <td className="p-4 font-medium">{meal.name}</td>
              <td className="p-4">
                <span className="px-3 py-1 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm capitalize">
                  {meal.category}
                </span>
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">
                {meal.ingredients.length} items
              </td>
              <td className="p-4 capitalize text-gray-600 dark:text-gray-400">
                {meal.difficulty || 'N/A'}
              </td>
              <td className="p-4">
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onView(meal)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(meal)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(meal)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

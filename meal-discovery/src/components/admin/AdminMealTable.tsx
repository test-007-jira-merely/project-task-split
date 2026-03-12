import { Edit, Trash2 } from 'lucide-react';
import { Meal } from '@/types/meal.types';

interface AdminMealTableProps {
  meals: Meal[];
  onEdit: (meal: Meal) => void;
  onDelete: (mealId: string) => void;
}

export function AdminMealTable({ meals, onEdit, onDelete }: AdminMealTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Image
            </th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Name
            </th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Category
            </th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Difficulty
            </th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Prep Time
            </th>
            <th className="text-right py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {meals.map((meal) => (
            <tr
              key={meal.id}
              className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <td className="py-4 px-4">
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </td>
              <td className="py-4 px-4">
                <p className="font-medium text-slate-900 dark:text-white">{meal.name}</p>
              </td>
              <td className="py-4 px-4">
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 capitalize">
                  {meal.category}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                  {meal.difficulty || '-'}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {meal.prepTime ? `${meal.prepTime} min` : '-'}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(meal)}
                    className="p-2 text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(meal.id)}
                    className="p-2 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

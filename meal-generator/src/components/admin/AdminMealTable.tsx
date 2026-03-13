import { Meal } from '@types/meal';
import { Button } from '@components/ui/Button';
import { Edit, Trash2 } from 'lucide-react';

interface AdminMealTableProps {
  meals: Meal[];
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
}

export function AdminMealTable({ meals, onEdit, onDelete }: AdminMealTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">Image</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">Category</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">Ingredients</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700 dark:text-neutral-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {meals.map((meal) => (
            <tr key={meal.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
              <td className="px-4 py-3">
                <img src={meal.imageUrl} alt={meal.name} className="w-16 h-16 object-cover rounded-lg" />
              </td>
              <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">{meal.name}</td>
              <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 capitalize">{meal.category}</td>
              <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{meal.ingredients.length} items</td>
              <td className="px-4 py-3 text-right space-x-2">
                <Button size="sm" variant="ghost" onClick={() => onEdit(meal)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="danger" onClick={() => onDelete(meal.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

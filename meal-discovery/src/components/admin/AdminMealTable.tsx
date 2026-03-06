import { AdminMealTableProps } from '@/types/components';
import { Button } from '../ui/Button';
import { Edit, Trash2 } from 'lucide-react';

export const AdminMealTable = ({ meals, onEdit, onDelete }: AdminMealTableProps) => {
  return (
    <div className="overflow-x-auto bg-card rounded-2xl border border-border">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-border">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Ingredients
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {meals.map((meal) => (
            <tr key={meal.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="px-6 py-4">
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium">{meal.name}</div>
                <div className="text-xs text-gray-500 line-clamp-1">{meal.description}</div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                  {meal.category}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                {meal.ingredients.length} items
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(meal)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this meal?')) {
                        onDelete(meal.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

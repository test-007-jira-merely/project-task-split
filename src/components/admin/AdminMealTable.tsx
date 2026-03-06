import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Meal } from '@/types/meal';

interface AdminMealTableProps {
  meals: Meal[];
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
}

export const AdminMealTable = ({ meals, onEdit, onDelete }: AdminMealTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 font-semibold">Image</th>
            <th className="text-left p-4 font-semibold">Name</th>
            <th className="text-left p-4 font-semibold">Category</th>
            <th className="text-left p-4 font-semibold">Ingredients</th>
            <th className="text-right p-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {meals.map(meal => (
            <tr key={meal.id} className="border-b border-border hover:bg-accent/50 transition-colors">
              <td className="p-4">
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  className="w-16 h-16 object-cover rounded-xl"
                />
              </td>
              <td className="p-4 font-medium">{meal.name}</td>
              <td className="p-4">
                <span className="px-2 py-1 rounded-lg bg-accent text-xs capitalize">
                  {meal.category}
                </span>
              </td>
              <td className="p-4 text-sm text-muted-foreground">
                {meal.ingredients.length} ingredients
              </td>
              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => onEdit(meal)}
                    variant="ghost"
                    size="sm"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    onClick={() => onDelete(meal.id)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 size={16} className="text-red-500" />
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

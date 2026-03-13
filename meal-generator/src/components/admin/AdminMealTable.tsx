import { useState } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Meal } from '@/types/meal';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface AdminMealTableProps {
  meals: Meal[];
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
  isDeleting?: string;
}

export const AdminMealTable = ({ meals, onEdit, onDelete, isDeleting }: AdminMealTableProps) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [previewMeal, setPreviewMeal] = useState<Meal | null>(null);

  const handleDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirm(null);
  };

  return (
    <>
      <Card glass>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Image
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Ingredients
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal) => (
                <motion.tr
                  key={meal.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4">
                    <img
                      src={meal.imageUrl}
                      alt={meal.name}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {meal.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {meal.description}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary" size="sm">
                      {meal.category}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {meal.ingredients.length}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewMeal(meal)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(meal)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(meal.id)}
                        isLoading={isDeleting === meal.id}
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this meal? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!previewMeal}
        onClose={() => setPreviewMeal(null)}
        title="Meal Preview"
        size="lg"
      >
        {previewMeal && (
          <div className="space-y-4">
            <img
              src={previewMeal.imageUrl}
              alt={previewMeal.name}
              className="w-full h-64 object-cover rounded-2xl"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {previewMeal.name}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {previewMeal.description}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Ingredients ({previewMeal.ingredients.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {previewMeal.ingredients.map((ing, i) => (
                  <Badge key={i} variant="secondary" size="sm">
                    {ing}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

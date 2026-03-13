import { useState } from 'react';
import { Plus, Upload, Pencil, Trash2 } from 'lucide-react';
import { useMeals, useCreateMeal, useUpdateMeal, useDeleteMeal, useImportMeals } from '@/hooks/useMeals';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { AdminMealForm } from '@/components/admin/AdminMealForm';
import { sampleMeals } from '@/utils/sampleData';
import { Meal } from '@/types';

export function AdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | undefined>();

  const { data: meals = [], isLoading } = useMeals();
  const createMeal = useCreateMeal();
  const updateMeal = useUpdateMeal();
  const deleteMeal = useDeleteMeal();
  const importMeals = useImportMeals();

  const handleCreate = async (data: Omit<Meal, 'id' | 'created_at'>) => {
    await createMeal.mutateAsync(data);
    setShowForm(false);
  };

  const handleUpdate = async (data: Omit<Meal, 'id' | 'created_at'>) => {
    if (editingMeal) {
      await updateMeal.mutateAsync({ id: editingMeal.id, meal: data });
      setEditingMeal(undefined);
      setShowForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      await deleteMeal.mutateAsync(id);
    }
  };

  const handleImportSampleData = async () => {
    if (confirm('This will import sample meals. Continue?')) {
      await importMeals.mutateAsync(sampleMeals);
    }
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const text = await file.text();
        const data = JSON.parse(text);
        await importMeals.mutateAsync(data);
      }
    };
    input.click();
  };

  if (isLoading) {
    return <LoadingSkeleton className="h-96" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage meals and datasets
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImportSampleData}>
            <Upload className="w-4 h-4 mr-2" />
            Import Sample Data
          </Button>
          <Button variant="outline" onClick={handleImportJSON}>
            <Upload className="w-4 h-4 mr-2" />
            Import JSON
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Meal
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
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
                <tr
                  key={meal.id}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  <td className="py-3 px-4 text-gray-900 dark:text-white">
                    {meal.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {meal.category}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {meal.ingredients.length} items
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingMeal(meal);
                          setShowForm(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(meal.id)}
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
      </Card>

      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingMeal(undefined);
        }}
        title={editingMeal ? 'Edit Meal' : 'Create New Meal'}
      >
        <AdminMealForm
          meal={editingMeal}
          onSubmit={editingMeal ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingMeal(undefined);
          }}
          isLoading={createMeal.isPending || updateMeal.isPending}
        />
      </Modal>
    </div>
  );
}

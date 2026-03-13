import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AdminLayout } from '@components/admin/AdminLayout';
import { AdminMealTable } from '@components/admin/AdminMealTable';
import { AdminMealForm } from '@components/admin/AdminMealForm';
import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { useMeals } from '@hooks/useMeals';
import { LoadingSkeleton } from '@components/ui/LoadingSkeleton';
import type { Meal } from '@types/meal';

export function Admin() {
  const { meals, isLoading, createMeal, updateMeal, deleteMeal } = useMeals();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | undefined>();

  const handleCreate = () => {
    setEditingMeal(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      await deleteMeal(id);
    }
  };

  const handleSubmit = async (data: any) => {
    if (editingMeal) {
      await updateMeal({ id: editingMeal.id, meal: data });
    } else {
      await createMeal(data);
    }
    setIsFormOpen(false);
    setEditingMeal(undefined);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Meal Management</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {meals.length} total meals
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-5 h-5 mr-2" />
            Add Meal
          </Button>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <LoadingSkeleton count={5} className="h-20 mb-4" />
            </div>
          ) : (
            <AdminMealTable meals={meals} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingMeal(undefined);
        }}
        title={editingMeal ? 'Edit Meal' : 'Create New Meal'}
        size="xl"
      >
        <AdminMealForm
          meal={editingMeal}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingMeal(undefined);
          }}
        />
      </Modal>
    </AdminLayout>
  );
}

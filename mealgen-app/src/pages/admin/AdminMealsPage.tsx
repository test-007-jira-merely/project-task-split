import { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import AdminMealTable from '@/components/admin/AdminMealTable';
import AdminMealForm from '@/components/admin/AdminMealForm';
import { useAdminMeals } from '@/hooks/useAdminMeals';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useToast } from '@/components/ui/Toast';
import type { Meal, MealFormData } from '@/types';

export default function AdminMealsPage() {
  useAdminCheck();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const { meals, isLoading, createMeal, updateMeal, deleteMeal, isCreating, isUpdating } =
    useAdminMeals();
  const { showToast } = useToast();

  const handleCreate = () => {
    setEditingMeal(null);
    setIsModalOpen(true);
  };

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: MealFormData) => {
    if (editingMeal) {
      updateMeal(
        { id: editingMeal.id, meal: data },
        {
          onSuccess: () => {
            showToast('Meal updated successfully', 'success');
            setIsModalOpen(false);
            setEditingMeal(null);
          },
          onError: (error: any) => {
            showToast(`Failed to update meal: ${error.message}`, 'error');
          },
        }
      );
    } else {
      createMeal(data, {
        onSuccess: () => {
          showToast('Meal created successfully', 'success');
          setIsModalOpen(false);
        },
        onError: (error: any) => {
          showToast(`Failed to create meal: ${error.message}`, 'error');
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteMeal(id, {
      onSuccess: () => {
        showToast('Meal deleted successfully', 'success');
      },
      onError: (error: any) => {
        showToast(`Failed to delete meal: ${error.message}`, 'error');
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Meals</h1>
          <p className="text-muted-foreground">Manage your meal database</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-5 h-5 mr-2" />
          Create Meal
        </Button>
      </div>

      <AdminMealTable
        meals={meals}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMeal(null);
        }}
        title={editingMeal ? 'Edit Meal' : 'Create New Meal'}
      >
        <AdminMealForm
          meal={editingMeal || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingMeal(null);
          }}
          isLoading={isCreating || isUpdating}
        />
      </Modal>
    </div>
  );
}

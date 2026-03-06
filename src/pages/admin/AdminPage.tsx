import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AdminMealTable } from '@/components/admin/AdminMealTable';
import { AdminMealForm } from '@/components/admin/AdminMealForm';
import { Modal } from '@/components/ui/Modal';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { getMeals, createMeal, updateMeal, deleteMeal, importMeals } from '@/services/supabaseData';
import { getAllMeals } from '@/services/mealService';
import { Meal } from '@/types/meal';

export const AdminPage = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['admin-meals'],
    queryFn: getMeals,
  });

  const createMutation = useMutation({
    mutationFn: createMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-meals'] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Meal> }) => updateMeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-meals'] });
      setIsFormOpen(false);
      setEditingMeal(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-meals'] });
    },
  });

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const localMeals = await getAllMeals();
      await importMeals(localMeals);
      queryClient.invalidateQueries({ queryKey: ['admin-meals'] });
      alert('Import successful!');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Check console for details.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (data: Omit<Meal, 'id'>) => {
    if (editingMeal) {
      updateMutation.mutate({ id: editingMeal.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage meals and dataset</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleImport} variant="secondary" isLoading={isImporting}>
            <Upload size={20} />
            <span className="ml-2">Import Dataset</span>
          </Button>
          <Button
            onClick={() => {
              setEditingMeal(null);
              setIsFormOpen(true);
            }}
          >
            <Plus size={20} />
            <span className="ml-2">Add Meal</span>
          </Button>
        </div>
      </div>

      <Card glass>
        {isLoading ? (
          <LoadingSkeleton type="list" count={5} />
        ) : (
          <AdminMealTable
            meals={meals}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingMeal(null);
        }}
        title={editingMeal ? 'Edit Meal' : 'Create Meal'}
        size="xl"
      >
        <AdminMealForm
          meal={editingMeal}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
};

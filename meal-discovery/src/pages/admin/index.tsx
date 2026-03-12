import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMeals, useCreateMeal, useUpdateMeal, useDeleteMeal, useImportMeals } from '@/hooks/useMeals';
import { isAdmin } from '@/services/supabase';
import { AdminMealTable } from '@/components/admin/AdminMealTable';
import { AdminMealForm } from '@/components/admin/AdminMealForm';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Meal } from '@/types';
import { Plus, Upload, Shield } from 'lucide-react';
import mealsData from '@/data/meals.json';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: meals, isLoading } = useMeals();
  const createMeal = useCreateMeal();
  const updateMeal = useUpdateMeal();
  const deleteMeal = useDeleteMeal();
  const importMeals = useImportMeals();

  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin(user.email)) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || !isAdmin(user.email)) {
    return (
      <EmptyState
        icon={<Shield className="w-16 h-16" />}
        title="Access Denied"
        description="You don't have permission to access this page"
        action={{
          label: 'Go Home',
          onClick: () => navigate('/'),
        }}
      />
    );
  }

  const handleImportDataset = async () => {
    if (confirm('This will import all meals from the local dataset. Continue?')) {
      try {
        await importMeals.mutateAsync(mealsData as Meal[]);
        alert('Dataset imported successfully!');
      } catch (error) {
        alert('Failed to import dataset');
      }
    }
  };

  const handleSubmit = async (mealData: any) => {
    try {
      if (editingMeal) {
        await updateMeal.mutateAsync({ id: editingMeal.id, meal: mealData });
      } else {
        await createMeal.mutateAsync(mealData);
      }
      setEditingMeal(null);
      setIsCreating(false);
    } catch (error) {
      alert('Failed to save meal');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMeal.mutateAsync(id);
    } catch (error) {
      alert('Failed to delete meal');
    }
  };

  if (isCreating || editingMeal) {
    return (
      <div className="max-w-4xl mx-auto">
        <AdminMealForm
          meal={editingMeal || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setEditingMeal(null);
            setIsCreating(false);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage meals and import datasets
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleImportDataset}>
            <Upload className="w-4 h-4 mr-2" />
            Import Dataset
          </Button>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Meal
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="list" count={5} />
      ) : meals && meals.length > 0 ? (
        <AdminMealTable
          meals={meals}
          onEdit={setEditingMeal}
          onDelete={handleDelete}
        />
      ) : (
        <EmptyState
          title="No meals in database"
          description="Import the dataset or create your first meal"
          action={{
            label: 'Import Dataset',
            onClick: handleImportDataset,
          }}
        />
      )}
    </div>
  );
};

export default Admin;

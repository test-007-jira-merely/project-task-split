import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminMealTable } from '@/components/admin/AdminMealTable';
import { AdminMealForm } from '@/components/admin/AdminMealForm';
import { ImportData } from '@/components/admin/ImportData';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { mealService } from '@/services/mealService';
import { Meal } from '@/types/meal';
import { MealFormData } from '@/schemas/mealSchema';

type AdminTab = 'meals' | 'import' | 'create';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('meals');
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const queryClient = useQueryClient();

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['meals'],
    queryFn: mealService.getAll,
  });

  const createMeal = useMutation({
    mutationFn: (data: MealFormData) => mealService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setActiveTab('meals');
    },
  });

  const updateMeal = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Meal> }) =>
      mealService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setEditingMeal(null);
      setActiveTab('meals');
    },
  });

  const deleteMeal = useMutation({
    mutationFn: (id: string) => mealService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  const handleSubmit = async (data: MealFormData) => {
    if (editingMeal) {
      await updateMeal.mutateAsync({ id: editingMeal.id, data });
    } else {
      await createMeal.mutateAsync(data);
    }
  };

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setActiveTab('create');
  };

  const handleCancel = () => {
    setEditingMeal(null);
    setActiveTab('meals');
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'meals' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400">
              {meals.length} total meals
            </p>
            <Button onClick={() => setActiveTab('create')}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Meal
            </Button>
          </div>

          {isLoading ? (
            <Skeleton height="400px" />
          ) : (
            <AdminMealTable
              meals={meals}
              onEdit={handleEdit}
              onDelete={deleteMeal.mutate}
              isDeleting={deleteMeal.variables}
            />
          )}
        </div>
      )}

      {activeTab === 'import' && <ImportData />}

      {activeTab === 'create' && (
        <AdminMealForm
          meal={editingMeal || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createMeal.isPending || updateMeal.isPending}
        />
      )}
    </AdminLayout>
  );
};

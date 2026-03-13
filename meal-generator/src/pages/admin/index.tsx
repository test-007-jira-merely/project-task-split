import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Upload, Edit, Trash2 } from 'lucide-react';
import { mealService } from '../../services/mealService';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminMealForm } from '../../components/admin/AdminMealForm';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import type { Meal } from '../../types';

export function Admin() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | undefined>();
  const [isImportOpen, setIsImportOpen] = useState(false);

  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: () => mealService.getAllMeals(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Meal>) => mealService.createMeal(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setIsFormOpen(false);
      setSelectedMeal(undefined);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Meal> }) =>
      mealService.updateMeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setIsFormOpen(false);
      setSelectedMeal(undefined);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => mealService.deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  const importMutation = useMutation({
    mutationFn: (meals: any[]) => mealService.importMeals(meals),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setIsImportOpen(false);
    },
  });

  const handleSubmit = async (data: Partial<Meal>) => {
    if (selectedMeal) {
      await updateMutation.mutateAsync({ id: selectedMeal.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const data = JSON.parse(text);
    await importMutation.mutateAsync(Array.isArray(data) ? data : [data]);
  };

  return (
    <AdminLayout>
      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => {
            setSelectedMeal(undefined);
            setIsFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Meal
        </Button>
        <Button variant="outline" onClick={() => setIsImportOpen(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Import Dataset
        </Button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {meals.map((meal) => (
                <tr key={meal.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={meal.imageUrl}
                        alt={meal.name}
                        className="w-10 h-10 rounded-lg object-cover mr-3"
                      />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {meal.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize text-gray-600 dark:text-gray-400">
                      {meal.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize text-gray-600 dark:text-gray-400">
                      {meal.difficulty || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedMeal(meal);
                          setIsFormOpen(true);
                        }}
                        className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this meal?')) {
                            deleteMutation.mutate(meal.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedMeal(undefined);
        }}
        title={selectedMeal ? 'Edit Meal' : 'Create New Meal'}
        size="lg"
      >
        <AdminMealForm
          meal={selectedMeal}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedMeal(undefined);
          }}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Import Meal Dataset"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Upload a JSON file containing an array of meals to import into the database.
          </p>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-50 file:text-primary-700
              hover:file:bg-primary-100
              dark:file:bg-primary-900 dark:file:text-primary-300
              dark:hover:file:bg-primary-800"
          />
          {importMutation.isPending && (
            <p className="text-sm text-primary-600">Importing...</p>
          )}
          {importMutation.isSuccess && (
            <p className="text-sm text-green-600">Import successful!</p>
          )}
        </div>
      </Modal>
    </AdminLayout>
  );
}

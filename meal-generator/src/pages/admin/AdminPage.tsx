import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Upload, Pencil, Trash2 } from 'lucide-react';
import { AnimatedContainer } from '../../components/ui/AnimatedContainer';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { AdminMealForm } from '../../components/admin/AdminMealForm';
import { fetchMeals, createMeal, updateMeal, deleteMeal, importMealsFromJSON } from '../../services/mealService';
import type { Meal } from '../../types';

export const AdminPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | undefined>();
  const [isImportOpen, setIsImportOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: fetchMeals,
  });

  const createMutation = useMutation({
    mutationFn: createMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Meal> }) => updateMeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setIsFormOpen(false);
      setEditingMeal(undefined);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  const handleSubmit = async (data: Omit<Meal, 'id' | 'created_at'>) => {
    if (editingMeal) {
      await updateMutation.mutateAsync({ id: editingMeal.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importMealsFromJSON(data);
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setIsImportOpen(false);
      alert('Meals imported successfully!');
    } catch (error) {
      alert('Failed to import meals. Please check the file format.');
    }
  };

  return (
    <div className="space-y-8">
      <AnimatedContainer>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your meal database
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsImportOpen(true)}
              variant="secondary"
              size="md"
            >
              <Upload className="w-5 h-5 mr-2" />
              Import JSON
            </Button>
            <Button
              onClick={() => {
                setEditingMeal(undefined);
                setIsFormOpen(true);
              }}
              size="md"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Meal
            </Button>
          </div>
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.1}>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-glass dark:shadow-glass-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Meal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ingredients
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {meals.map((meal) => (
                  <tr key={meal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={meal.imageUrl}
                          alt={meal.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {meal.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {meal.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {meal.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {meal.ingredients.length}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingMeal(meal);
                            setIsFormOpen(true);
                          }}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(meal.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedContainer>

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingMeal(undefined);
        }}
        title={editingMeal ? 'Edit Meal' : 'Create New Meal'}
        size="lg"
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

      <Modal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Import Meals from JSON"
      >
        <div className="p-6">
          <input
            type="file"
            accept=".json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
            }}
            className="w-full"
          />
        </div>
      </Modal>
    </div>
  );
};

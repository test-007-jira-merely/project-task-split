import { useState } from 'react';
import { Plus, Upload, Edit, Trash2 } from 'lucide-react';
import { Button, Card, Modal } from '../../components/ui';
import { AdminMealForm } from '../../components/admin/AdminMealForm';
import { useMeals, useCreateMeal, useUpdateMeal, useDeleteMeal, useBulkImportMeals } from '../../hooks';
import type { Meal } from '../../types';

export default function AdminPage() {
  const { data: meals, isLoading } = useMeals();
  const createMeal = useCreateMeal();
  const updateMeal = useUpdateMeal();
  const deleteMeal = useDeleteMeal();
  const bulkImport = useBulkImportMeals();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | undefined>(undefined);
  const [isImporting, setIsImporting] = useState(false);

  const handleCreate = async (data: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>) => {
    await createMeal.mutateAsync(data);
    setIsFormOpen(false);
  };

  const handleUpdate = async (data: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingMeal) return;
    await updateMeal.mutateAsync({ id: editingMeal.id, data });
    setEditingMeal(undefined);
    setIsFormOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      await deleteMeal.mutateAsync(id);
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const meals = Array.isArray(data) ? data : [data];
      await bulkImport.mutateAsync(meals);
      alert(`Successfully imported ${meals.length} meals`);
    } catch (error) {
      alert('Error importing meals. Please check the JSON format.');
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  const openCreateForm = () => {
    setEditingMeal(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (meal: Meal) => {
    setEditingMeal(meal);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Meal Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create, edit, and manage your meal database
          </p>
        </div>
        <div className="flex gap-3">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileImport}
              disabled={isImporting}
            />
            <Button variant="secondary" as="span">
              <Upload className="w-4 h-4 mr-2" />
              {isImporting ? 'Importing...' : 'Import JSON'}
            </Button>
          </label>
          <Button onClick={openCreateForm}>
            <Plus className="w-4 h-4 mr-2" />
            Create Meal
          </Button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Meal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ingredients
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Loading meals...
                  </td>
                </tr>
              ) : meals?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No meals found. Create your first meal or import a dataset.
                  </td>
                </tr>
              ) : (
                meals?.map((meal) => (
                  <tr key={meal.id} className="hover:bg-gray-50 dark:hover:bg-dark-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={meal.imageUrl}
                          alt={meal.name}
                          className="w-12 h-12 rounded-lg object-cover"
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
                    <td className="px-6 py-4">
                      <span className="capitalize text-sm text-gray-700 dark:text-gray-300">
                        {meal.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-sm text-gray-700 dark:text-gray-300">
                        {meal.difficulty || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {meal.ingredients.length}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditForm(meal)}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(meal.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
          onSubmit={editingMeal ? handleUpdate : handleCreate}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingMeal(undefined);
          }}
          isSubmitting={createMeal.isPending || updateMeal.isPending}
        />
      </Modal>
    </div>
  );
}

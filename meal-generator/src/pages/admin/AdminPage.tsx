import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { MealForm } from '@/components/admin/MealForm';
import { mealService } from '@/services/mealService';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { Meal } from '@/types/meal';
import sampleMeals from '@/data/sample-meals.json';

export function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [showImport, setShowImport] = useState(false);

  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: mealService.getAllMeals,
  });

  const createMutation = useMutation({
    mutationFn: mealService.createMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Meal> }) =>
      mealService.updateMeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setShowForm(false);
      setEditingMeal(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: mealService.deleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  const importMutation = useMutation({
    mutationFn: mealService.importMeals,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setShowImport(false);
    },
  });

  if (!user?.isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You must be an admin to access this page
          </p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    if (editingMeal) {
      await updateMutation.mutateAsync({ id: editingMeal.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleImport = async () => {
    await importMutation.mutateAsync(sampleMeals as any[]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage meals and content
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowImport(true)} variant="secondary" className="gap-2">
            <Upload className="w-4 h-4" />
            Import Sample Data
          </Button>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Meal
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
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
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {meals.map((meal) => (
              <tr key={meal.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={meal.imageUrl}
                      alt={meal.name}
                      className="w-10 h-10 rounded-lg object-cover mr-3"
                    />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {meal.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium capitalize">
                    {meal.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                  {meal.difficulty || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setEditingMeal(meal);
                      setShowForm(true);
                    }}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 mr-4"
                  >
                    <Edit className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this meal?')) {
                        deleteMutation.mutate(meal.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingMeal(null);
        }}
        title={editingMeal ? 'Edit Meal' : 'Create New Meal'}
        size="lg"
      >
        <MealForm
          meal={editingMeal || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingMeal(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        title="Import Sample Data"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            This will import {sampleMeals.length} sample meals into your database. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={handleImport}
              disabled={importMutation.isPending}
              className="flex-1"
            >
              {importMutation.isPending ? 'Importing...' : 'Import Now'}
            </Button>
            <Button variant="secondary" onClick={() => setShowImport(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, Database, AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { AdminMealTable } from '../../components/admin/AdminMealTable';
import { AdminMealForm } from '../../components/admin/AdminMealForm';
import { DatasetImport } from '../../components/admin/DatasetImport';
import { MealDetailsModal } from '../../components/meal/MealDetailsModal';
import { useMeals } from '../../hooks/useMeals';
import { mealService } from '../../services/mealService';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import type { Meal } from '../../types';

const AdminPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const { data: meals = [], isLoading } = useMeals();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Omit<Meal, 'id' | 'created_at'>) => mealService.createMeal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setIsFormOpen(false);
      setSelectedMeal(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Meal, 'id'>> }) =>
      mealService.updateMeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setIsFormOpen(false);
      setSelectedMeal(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => mealService.deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setIsDeleteConfirmOpen(false);
      setSelectedMeal(null);
    },
  });

  const handleCreate = () => {
    setSelectedMeal(null);
    setIsFormOpen(true);
  };

  const handleEdit = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsFormOpen(true);
  };

  const handleDelete = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsDeleteConfirmOpen(true);
  };

  const handleView = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsViewOpen(true);
  };

  const handleSubmit = (data: Omit<Meal, 'id' | 'created_at'>) => {
    if (selectedMeal) {
      updateMutation.mutate({ id: selectedMeal.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const confirmDelete = () => {
    if (selectedMeal) {
      deleteMutation.mutate(selectedMeal.id);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Manage meals, import datasets, and configure the application
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <Database className="w-12 h-12 text-primary-600 mb-4" />
          <h3 className="text-3xl font-bold mb-2">{meals.length}</h3>
          <p className="text-gray-600 dark:text-gray-400">Total Meals</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <Button onClick={handleCreate} variant="primary" size="lg" className="w-full">
            <Plus className="w-5 h-5 mr-2" />
            Create New Meal
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <Button
            onClick={() => setIsImportOpen(true)}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            <Upload className="w-5 h-5 mr-2" />
            Import Dataset
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {meals.length === 0 ? (
          <div className="p-12 text-center">
            <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Meals Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first meal or import a dataset to get started
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button onClick={handleCreate} variant="primary">
                Create Meal
              </Button>
              <Button onClick={() => setIsImportOpen(true)} variant="outline">
                Import Dataset
              </Button>
            </div>
          </div>
        ) : (
          <AdminMealTable
            meals={meals}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}
      </motion.div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedMeal(null);
        }}
        title={selectedMeal ? 'Edit Meal' : 'Create New Meal'}
        size="xl"
      >
        <AdminMealForm
          meal={selectedMeal}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedMeal(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Import Meal Dataset"
        size="lg"
      >
        <DatasetImport
          onImportComplete={() => {
            setIsImportOpen(false);
            queryClient.invalidateQueries({ queryKey: ['meals'] });
          }}
        />
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setSelectedMeal(null);
        }}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-6">
          <div className="flex items-start space-x-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100 mb-1">
                Are you sure you want to delete this meal?
              </p>
              <p className="text-sm text-red-800 dark:text-red-200">
                This action cannot be undone. The meal "{selectedMeal?.name}" will be permanently removed.
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={confirmDelete}
              variant="danger"
              disabled={deleteMutation.isPending}
              className="flex-1"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Meal'}
            </Button>
            <Button
              onClick={() => {
                setIsDeleteConfirmOpen(false);
                setSelectedMeal(null);
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedMeal(null);
        }}
      />
    </div>
  );
};

export default AdminPage;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Database } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AdminMealForm } from '@/components/admin/AdminMealForm';
import { AdminMealTable } from '@/components/admin/AdminMealTable';
import { DatasetImport } from '@/components/admin/DatasetImport';
import { useMeals, useCreateMeal, useUpdateMeal, useDeleteMeal } from '@/hooks/useMeals';
import { Meal } from '@/types';

export default function AdminPage() {
  const { data: meals, isLoading } = useMeals();
  const { mutate: createMeal, isPending: isCreating } = useCreateMeal();
  const { mutate: updateMeal, isPending: isUpdating } = useUpdateMeal();
  const { mutate: deleteMeal } = useDeleteMeal();

  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

  const handleCreateOrUpdate = async (data: Partial<Meal>) => {
    if (editingMeal) {
      updateMeal(
        { id: editingMeal.id, meal: data },
        {
          onSuccess: () => {
            setShowForm(false);
            setEditingMeal(null);
          },
        }
      );
    } else {
      createMeal(
        data as Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>,
        {
          onSuccess: () => {
            setShowForm(false);
          },
        }
      );
    }
  };

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      deleteMeal(id);
    }
  };

  const stats = {
    total: meals?.length || 0,
    breakfast: meals?.filter(m => m.category === 'breakfast').length || 0,
    lunch: meals?.filter(m => m.category === 'lunch').length || 0,
    dinner: meals?.filter(m => m.category === 'dinner').length || 0,
    snack: meals?.filter(m => m.category === 'snack').length || 0,
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-foreground/60">Manage your meal database</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowImport(true)}>
            <Database className="w-5 h-5 mr-2" />
            Import Dataset
          </Button>
          <Button variant="primary" onClick={() => setShowForm(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Add Meal
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <div className="glass-card p-6">
          <p className="text-foreground/60 text-sm mb-1">Total Meals</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-foreground/60 text-sm mb-1">Breakfast</p>
          <p className="text-3xl font-bold">{stats.breakfast}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-foreground/60 text-sm mb-1">Lunch</p>
          <p className="text-3xl font-bold">{stats.lunch}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-foreground/60 text-sm mb-1">Dinner</p>
          <p className="text-3xl font-bold">{stats.dinner}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-foreground/60 text-sm mb-1">Snacks</p>
          <p className="text-3xl font-bold">{stats.snack}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AdminMealTable
          meals={meals || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </motion.div>

      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingMeal(null);
        }}
        title={editingMeal ? 'Edit Meal' : 'Create New Meal'}
        size="xl"
      >
        <AdminMealForm
          meal={editingMeal || undefined}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setShowForm(false);
            setEditingMeal(null);
          }}
          isLoading={isCreating || isUpdating}
        />
      </Modal>

      <Modal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        title="Import Meal Dataset"
        size="lg"
      >
        <DatasetImport />
      </Modal>
    </div>
  );
}

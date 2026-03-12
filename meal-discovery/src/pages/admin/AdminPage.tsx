import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Upload, Plus, List } from 'lucide-react';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminMealTable } from '@/components/admin/AdminMealTable';
import { AdminMealForm } from '@/components/admin/AdminMealForm';
import { useAppStore } from '@/stores/useAppStore';
import { mealService } from '@/services/supabase';
import { Meal } from '@/types/meal.types';

type TabType = 'list' | 'create' | 'import';

export default function AdminPage() {
  const user = useAppStore(state => state.user);
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMeal, setEditingMeal] = useState<Meal | undefined>(undefined);
  const [importText, setImportText] = useState('');

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    setLoading(true);
    try {
      const data = await mealService.getAllMeals();
      setMeals(data);
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (mealData: Omit<Meal, 'id'> | Meal) => {
    try {
      if ('id' in mealData) {
        await mealService.updateMealInSupabase(mealData.id, mealData);
      } else {
        await mealService.createMealInSupabase(mealData);
      }
      await loadMeals();
      setActiveTab('list');
      setEditingMeal(undefined);
    } catch (error) {
      console.error('Error saving meal:', error);
    }
  };

  const handleDelete = async (mealId: string) => {
    if (!confirm('Are you sure you want to delete this meal?')) return;

    try {
      await mealService.deleteMealInSupabase(mealId);
      await loadMeals();
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setActiveTab('create');
  };

  const handleImport = async () => {
    try {
      const importedMeals: Meal[] = JSON.parse(importText);
      await mealService.importMealsToSupabase(importedMeals);
      await loadMeals();
      setImportText('');
      setActiveTab('list');
    } catch (error) {
      console.error('Error importing meals:', error);
      alert('Failed to import meals. Please check the JSON format.');
    }
  };

  // Check if user is admin
  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSkeleton type="table" count={5} />
      </AdminLayout>
    );
  }

  return (
    <AnimatedContainer>
      <AdminLayout stats={{ totalMeals: meals.length, totalUsers: 0 }}>
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setActiveTab('list');
              setEditingMeal(undefined);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              activeTab === 'list'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            <List className="w-4 h-4" />
            Meals List
          </button>
          <button
            onClick={() => {
              setActiveTab('create');
              setEditingMeal(undefined);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              activeTab === 'create'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            <Plus className="w-4 h-4" />
            {editingMeal ? 'Edit Meal' : 'Create Meal'}
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              activeTab === 'import'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            <Upload className="w-4 h-4" />
            Import JSON
          </button>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-glass dark:shadow-glass-dark p-6">
          {activeTab === 'list' && (
            <AdminMealTable
              meals={meals}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {activeTab === 'create' && (
            <AdminMealForm
              meal={editingMeal}
              onSubmit={handleCreateOrUpdate}
              onCancel={() => {
                setActiveTab('list');
                setEditingMeal(undefined);
              }}
            />
          )}

          {activeTab === 'import' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Paste JSON Array
                </label>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  rows={15}
                  placeholder='[{"name": "...", "description": "...", ...}]'
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600 font-mono text-sm"
                />
              </div>
              <button
                onClick={handleImport}
                disabled={!importText.trim()}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl font-medium transition-colors"
              >
                Import Meals
              </button>
            </div>
          )}
        </div>
      </AdminLayout>
    </AnimatedContainer>
  );
}

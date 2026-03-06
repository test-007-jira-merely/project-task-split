import { useState } from 'react';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { AnimatedContainer, Button, Card, EmptyState, LoadingSkeleton } from '@/components/ui';
import { AppLayout } from '@/components/layout';
import { useMeals } from '@/hooks/useMeals';

export function AdminPage() {
  const { data: meals, isLoading } = useMeals();
  const [_selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const handleEdit = (mealId: string) => {
    setSelectedMeal(mealId);
    // TODO: Open edit modal
  };

  const handleDelete = (mealId: string) => {
    // TODO: Implement delete
    console.log('Delete meal:', mealId);
  };

  const handleCreate = () => {
    // TODO: Open create modal
    console.log('Create new meal');
  };

  const handleImport = () => {
    // TODO: Implement import
    console.log('Import meals');
  };

  return (
    <AppLayout>
      <AnimatedContainer>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Admin{' '}
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Panel
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Manage meals database
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleImport}
                variant="secondary"
                icon={<PlusIcon className="w-5 h-5" />}
              >
                Import
              </Button>
              <Button
                onClick={handleCreate}
                variant="primary"
                icon={<PlusIcon className="w-5 h-5" />}
              >
                Create Meal
              </Button>
            </div>
          </div>
        </div>

        {/* Meals Table */}
        <Card>
          {isLoading ? (
            <LoadingSkeleton count={5} height="h-16" />
          ) : !meals || meals.length === 0 ? (
            <EmptyState
              title="No meals found"
              description="Start by creating your first meal or importing meals from a file."
              action={{
                label: 'Create Meal',
                onClick: handleCreate,
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Difficulty
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Prep Time
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Ingredients
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {meals.map((meal) => (
                    <tr
                      key={meal.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={meal.imageUrl}
                            alt={meal.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {meal.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400 capitalize">
                        {meal.category}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400 capitalize">
                        {meal.difficulty || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {meal.preparationTime ? `${meal.preparationTime} min` : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {meal.ingredients.length}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(meal.id)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(meal.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {meals && meals.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Total meals: {meals.length}
          </div>
        )}
      </AnimatedContainer>
    </AppLayout>
  );
}

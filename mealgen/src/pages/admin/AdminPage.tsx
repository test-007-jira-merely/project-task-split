
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { adminService } from '@/services/adminService';
import { useMeals } from '@/hooks/useMeals';

import { TrashIcon } from '@heroicons/react/24/outline';

export function AdminPage() {
  const queryClient = useQueryClient();
  const { data: localMeals = [] } = useMeals();

  const importMutation = useMutation({
    mutationFn: () => adminService.importMeals(localMeals.map(m => ({
      name: m.name,
      description: m.description,
      imageUrl: m.imageUrl,
      ingredients: m.ingredients,
      instructions: m.instructions,
      category: m.category,
      preparationTime: m.preparationTime,
      difficulty: m.difficulty,
    }))),
    onSuccess: () => {
      alert('Meals imported successfully!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  const handleImport = () => {
    if (confirm(`Import ${localMeals.length} meals from local dataset?`)) {
      importMutation.mutate();
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Meal Management</h2>
          <div className="flex gap-2">
            <Button onClick={handleImport} variant="secondary" disabled={importMutation.isPending}>
              Import Local Dataset ({localMeals.length} meals)
            </Button>
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Ingredients</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {localMeals.slice(0, 10).map(meal => (
                  <tr key={meal.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-3">{meal.name}</td>
                    <td className="p-3 capitalize">{meal.category}</td>
                    <td className="p-3">{meal.ingredients.length} items</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => deleteMutation.mutate(meal.id)}
                          variant="danger"
                          size="sm"
                          icon={<TrashIcon className="w-4 h-4" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

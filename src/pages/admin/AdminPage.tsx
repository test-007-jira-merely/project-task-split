import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabaseService } from '@/services/supabase';
import { Button, LoadingSkeleton } from '@/components/ui';
import { Meal, SupabaseMeal } from '@/types';
import toast from 'react-hot-toast';
import mealsData from '@/data/meals.json';

const AdminPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['admin-meals'],
    queryFn: () => supabaseService.getMeals(),
  });

  const importMutation = useMutation({
    mutationFn: async () => {
      const mealsToImport = (mealsData as Meal[]).map(m => ({
        id: m.id,
        name: m.name,
        description: m.description,
        image_url: m.imageUrl,
        ingredients: m.ingredients,
        instructions: m.instructions,
        category: m.category,
        difficulty: m.difficulty,
        prep_time: m.prepTime,
      }));
      await supabaseService.importMeals(mealsToImport as SupabaseMeal[]);
    },
    onSuccess: () => {
      toast.success(`Imported ${mealsData.length} meals successfully`);
      queryClient.invalidateQueries({ queryKey: ['admin-meals'] });
    },
    onError: () => {
      toast.error('Failed to import meals');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => supabaseService.deleteMeal(id),
    onSuccess: () => {
      toast.success('Meal deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-meals'] });
    },
    onError: () => {
      toast.error('Failed to delete meal');
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">Admin Panel</h1>
        <LoadingSkeleton variant="card" height="400px" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">
            {meals.length} meals in database
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => importMutation.mutate()}
            loading={importMutation.isPending}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Dataset
          </Button>
          <Button variant="primary" onClick={() => {/* TODO: Add meal form */}}>
            <Plus className="h-4 w-4 mr-2" />
            New Meal
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Difficulty</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Prep Time</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {meals.map((meal, index) => (
                <motion.tr
                  key={meal.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="hover:bg-accent/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={meal.image_url}
                        alt={meal.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <span className="font-medium text-foreground">{meal.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground capitalize">
                    {meal.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground capitalize">
                    {meal.difficulty || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {meal.prep_time ? `${meal.prep_time} min` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          /* Edit logic */
                        }}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(meal.id)}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

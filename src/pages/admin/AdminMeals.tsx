import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CategoryBadge } from '@/components/meal/CategoryBadge';
import { mealService } from '@/services/mealService';

export default function AdminMeals() {
  const queryClient = useQueryClient();

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['meals'],
    queryFn: mealService.getAllMeals,
  });

  const deleteMutation = useMutation({
    mutationFn: mealService.deleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Manage Meals</h1>
          <p className="text-muted-foreground">{meals.length} total meals</p>
        </div>
        <Button>
          <Plus size={20} className="mr-2" />
          Add Meal
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {meals.map((meal) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={meal.imageUrl}
                    alt={meal.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">{meal.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {meal.description}
                    </p>
                    <div className="mt-2">
                      <CategoryBadge category={meal.category} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="secondary" size="sm">
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(meal.id)}
                    isLoading={deleteMutation.isPending}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Meal } from '../../types';

const mealSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  description: z.string().min(1, 'Description is required'),
  ingredients: z.string().min(1, 'Ingredients are required'),
  instructions: z.string().min(1, 'Instructions are required'),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  prepTime: z.number().min(0).optional(),
});

type MealFormData = z.infer<typeof mealSchema>;

interface AdminMealFormProps {
  meal?: Meal;
  onSubmit: (data: Partial<Meal>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function AdminMealForm({ meal, onSubmit, onCancel, loading }: AdminMealFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: meal ? {
      name: meal.name,
      imageUrl: meal.imageUrl,
      description: meal.description,
      ingredients: meal.ingredients.join(', '),
      instructions: meal.instructions.join('\n'),
      category: meal.category,
      difficulty: meal.difficulty,
      prepTime: meal.prepTime,
    } : undefined,
  });

  const handleFormSubmit = async (data: MealFormData) => {
    await onSubmit({
      ...data,
      ingredients: data.ingredients.split(',').map(i => i.trim()),
      instructions: data.instructions.split('\n').map(i => i.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Meal Name"
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label="Image URL"
        {...register('imageUrl')}
        error={errors.imageUrl?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ingredients (comma-separated)
        </label>
        <textarea
          {...register('ingredients')}
          rows={4}
          placeholder="flour, eggs, milk, butter"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {errors.ingredients && (
          <p className="mt-1 text-sm text-red-600">{errors.ingredients.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Instructions (one per line)
        </label>
        <textarea
          {...register('instructions')}
          rows={6}
          placeholder="Mix ingredients&#10;Heat pan&#10;Cook until golden"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {errors.instructions && (
          <p className="mt-1 text-sm text-red-600">{errors.instructions.message}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            {...register('category')}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty
          </label>
          <select
            {...register('difficulty')}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select...</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <Input
          label="Prep Time (min)"
          type="number"
          {...register('prepTime', { valueAsNumber: true })}
          error={errors.prepTime?.message}
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" loading={loading}>
          {meal ? 'Update Meal' : 'Create Meal'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X } from 'lucide-react';
import { Input, Button } from '../ui';
import type { Meal, Category, Difficulty } from '../../types';

const mealSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  prepTime: z.number().min(1).optional(),
  ingredients: z.array(z.object({ value: z.string().min(1) })).min(1, 'At least one ingredient required'),
  instructions: z.array(z.object({ value: z.string().min(1) })).min(1, 'At least one instruction required')
});

type MealFormData = z.infer<typeof mealSchema>;

interface AdminMealFormProps {
  meal?: Meal;
  onSubmit: (data: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AdminMealForm({ meal, onSubmit, onCancel, isSubmitting }: AdminMealFormProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: meal ? {
      name: meal.name,
      description: meal.description,
      imageUrl: meal.imageUrl,
      category: meal.category,
      difficulty: meal.difficulty,
      prepTime: meal.prepTime,
      ingredients: meal.ingredients.map(i => ({ value: i })),
      instructions: meal.instructions.map(i => ({ value: i }))
    } : {
      ingredients: [{ value: '' }],
      instructions: [{ value: '' }]
    }
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients'
  });

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control,
    name: 'instructions'
  });

  const handleFormSubmit = (data: MealFormData) => {
    onSubmit({
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      category: data.category,
      difficulty: data.difficulty,
      prepTime: data.prepTime,
      ingredients: data.ingredients.map(i => i.value),
      instructions: data.instructions.map(i => i.value)
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('name')}
          label="Meal Name"
          placeholder="Delicious Pasta"
          error={errors.name?.message}
        />
        <Input
          {...register('imageUrl')}
          label="Image URL"
          placeholder="https://..."
          error={errors.imageUrl?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="input-field resize-none"
          placeholder="A delicious meal that..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select {...register('category')} className="input-field">
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty
          </label>
          <select {...register('difficulty')} className="input-field">
            <option value="">Select...</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <Input
          {...register('prepTime', { valueAsNumber: true })}
          type="number"
          label="Prep Time (minutes)"
          placeholder="30"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ingredients
          </label>
          <button
            type="button"
            onClick={() => appendIngredient({ value: '' })}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...register(`ingredients.${index}.value`)}
                className="input-field"
                placeholder="2 cups flour"
              />
              {ingredientFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.ingredients && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.ingredients.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Instructions
          </label>
          <button
            type="button"
            onClick={() => appendInstruction({ value: '' })}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {instructionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <div className="flex-shrink-0 w-8 h-10 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg font-medium">
                {index + 1}
              </div>
              <textarea
                {...register(`instructions.${index}.value`)}
                rows={2}
                className="input-field resize-none flex-1"
                placeholder="Mix ingredients..."
              />
              {instructionFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg h-10"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.instructions && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.instructions.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {meal ? 'Update Meal' : 'Create Meal'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

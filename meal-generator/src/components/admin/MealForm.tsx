// @ts-nocheck
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Meal } from '@/types/meal';

const mealSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  prepTime: z.number().min(0).optional(),
  ingredients: z.array(z.string().min(1)).min(1, 'At least one ingredient required'),
  instructions: z.array(z.string().min(1)).min(1, 'At least one instruction required'),
});

type MealFormData = z.infer<typeof mealSchema>;

interface MealFormProps {
  meal?: Meal;
  onSubmit: (data: MealFormData) => Promise<void>;
  onCancel: () => void;
}

export function MealForm({ meal, onSubmit, onCancel }: MealFormProps) {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: meal ? {
      name: meal.name,
      description: meal.description,
      imageUrl: meal.imageUrl,
      category: meal.category,
      difficulty: meal.difficulty,
      prepTime: meal.prepTime,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
    } : {
      ingredients: [''],
      instructions: [''],
    },
  });

  // @ts-ignore
  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients',
  });

  // @ts-ignore
  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control,
    name: 'instructions',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            {...register('category')}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Difficulty
          </label>
          <select
            {...register('difficulty')}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select...</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <Input
          label="Prep Time (minutes)"
          type="number"
          {...register('prepTime', { valueAsNumber: true })}
          error={errors.prepTime?.message}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ingredients
          </label>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => appendIngredient('')}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`ingredients.${index}`)}
                error={errors.ingredients?.[index]?.message}
                placeholder={`Ingredient ${index + 1}`}
              />
              {ingredientFields.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  onClick={() => removeIngredient(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Instructions
          </label>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => appendInstruction('')}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {instructionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-2">
                {index + 1}
              </div>
              <Input
                {...register(`instructions.${index}`)}
                error={errors.instructions?.[index]?.message}
                placeholder={`Step ${index + 1}`}
              />
              {instructionFields.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  onClick={() => removeInstruction(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Saving...' : meal ? 'Update Meal' : 'Create Meal'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

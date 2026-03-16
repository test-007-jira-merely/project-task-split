import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { Meal } from '../../types';

const mealSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  imageUrl: z.string().url('Must be a valid URL'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  ingredients: z.array(z.object({ value: z.string().min(1) })).min(1, 'At least one ingredient required'),
  instructions: z.array(z.object({ value: z.string().min(1) })).min(1, 'At least one instruction required'),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  prepTime: z.coerce.number().min(1).optional(),
});

type MealFormData = z.infer<typeof mealSchema>;

interface AdminMealFormProps {
  meal?: Meal | null;
  onSubmit: (data: Omit<Meal, 'id' | 'created_at'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AdminMealForm = ({ meal, onSubmit, onCancel, isLoading }: AdminMealFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: meal
      ? {
          ...meal,
          ingredients: meal.ingredients.map((i) => ({ value: i })),
          instructions: meal.instructions.map((i) => ({ value: i })),
        }
      : {
          ingredients: [{ value: '' }],
          instructions: [{ value: '' }],
          category: 'breakfast',
        },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control,
    name: 'instructions',
  });

  const handleFormSubmit = (data: MealFormData) => {
    onSubmit({
      name: data.name,
      imageUrl: data.imageUrl,
      description: data.description,
      ingredients: data.ingredients.map((i) => i.value),
      instructions: data.instructions.map((i) => i.value),
      category: data.category,
      difficulty: data.difficulty,
      prepTime: data.prepTime,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Meal Name"
          placeholder="e.g., Classic Pancakes"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Image URL"
          placeholder="https://..."
          error={errors.imageUrl?.message}
          {...register('imageUrl')}
        />
      </div>

      <Textarea
        label="Description"
        placeholder="Describe the meal..."
        rows={3}
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Select
          label="Category"
          error={errors.category?.message}
          options={[
            { value: 'breakfast', label: 'Breakfast' },
            { value: 'lunch', label: 'Lunch' },
            { value: 'dinner', label: 'Dinner' },
            { value: 'snack', label: 'Snack' },
          ]}
          {...register('category')}
        />

        <Select
          label="Difficulty (Optional)"
          error={errors.difficulty?.message}
          options={[
            { value: '', label: 'Not specified' },
            { value: 'easy', label: 'Easy' },
            { value: 'medium', label: 'Medium' },
            { value: 'hard', label: 'Hard' },
          ]}
          {...register('difficulty')}
        />

        <Input
          label="Prep Time (minutes)"
          type="number"
          placeholder="30"
          error={errors.prepTime?.message}
          {...register('prepTime')}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Ingredients
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => appendIngredient({ value: '' })}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-3">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex space-x-2">
              <Input
                placeholder={`Ingredient ${index + 1}`}
                error={errors.ingredients?.[index]?.value?.message}
                {...register(`ingredients.${index}.value`)}
              />
              {ingredientFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeIngredient(index)}
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Instructions
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => appendInstruction({ value: '' })}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-3">
          {instructionFields.map((field, index) => (
            <div key={field.id} className="flex space-x-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold mt-2">
                {index + 1}
              </div>
              <Textarea
                placeholder={`Step ${index + 1}`}
                rows={2}
                error={errors.instructions?.[index]?.value?.message}
                {...register(`instructions.${index}.value`)}
              />
              {instructionFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeInstruction(index)}
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button type="submit" variant="primary" size="lg" disabled={isLoading}>
          {isLoading ? 'Saving...' : meal ? 'Update Meal' : 'Create Meal'}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

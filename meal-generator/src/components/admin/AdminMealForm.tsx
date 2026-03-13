import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Meal } from '@/types';

const mealSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  prepTime: z.number().min(1).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  ingredients: z.array(z.object({ value: z.string().min(1) })).min(1),
  instructions: z.array(z.object({ value: z.string().min(1) })).min(1),
});

type MealFormData = z.infer<typeof mealSchema>;

interface AdminMealFormProps {
  meal?: Meal;
  onSubmit: (data: Omit<Meal, 'id' | 'created_at'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AdminMealForm({ meal, onSubmit, onCancel, isLoading }: AdminMealFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: meal?.name || '',
      description: meal?.description || '',
      imageUrl: meal?.imageUrl || '',
      category: meal?.category || 'breakfast',
      prepTime: meal?.prepTime,
      difficulty: meal?.difficulty,
      ingredients: meal?.ingredients.map((i) => ({ value: i })) || [{ value: '' }],
      instructions: meal?.instructions.map((i) => ({ value: i })) || [{ value: '' }],
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: 'ingredients' });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({ control, name: 'instructions' });

  const imageUrl = watch('imageUrl');

  const handleFormSubmit = (data: MealFormData) => {
    onSubmit({
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      category: data.category,
      prepTime: data.prepTime,
      difficulty: data.difficulty,
      ingredients: data.ingredients.map((i) => i.value),
      instructions: data.instructions.map((i) => i.value),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Meal Name"
        {...register('name')}
        error={errors.name?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <Input
        label="Image URL"
        {...register('imageUrl')}
        error={errors.imageUrl?.message}
      />

      {imageUrl && (
        <div className="rounded-2xl overflow-hidden">
          <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            {...register('category')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <Input
          label="Prep Time (minutes)"
          type="number"
          {...register('prepTime', { valueAsNumber: true })}
          error={errors.prepTime?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Difficulty
          </label>
          <select
            {...register('difficulty')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select...</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ingredients
          </label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => appendIngredient({ value: '' })}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`ingredients.${index}.value`)}
                error={errors.ingredients?.[index]?.value?.message}
                className="flex-1"
              />
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => removeIngredient(index)}
                disabled={ingredientFields.length === 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
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
            variant="outline"
            onClick={() => appendInstruction({ value: '' })}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {instructionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <span className="text-gray-600 dark:text-gray-400 font-medium pt-2">
                {index + 1}.
              </span>
              <Input
                {...register(`instructions.${index}.value`)}
                error={errors.instructions?.[index]?.value?.message}
                className="flex-1"
              />
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => removeInstruction(index)}
                disabled={instructionFields.length === 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : meal ? 'Update Meal' : 'Create Meal'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

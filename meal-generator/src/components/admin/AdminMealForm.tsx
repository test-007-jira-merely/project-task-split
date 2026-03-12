import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { AdminMealFormProps } from '@/components/interfaces';
import { Button } from '@/components/ui/Button';
import { MEAL_CATEGORIES, DIFFICULTY_LEVELS } from '@/utils/constants';

const mealSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url('Must be a valid URL'),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  preparationTime: z.number().min(1).optional(),
  ingredients: z.array(z.string().min(1)).min(1, 'At least one ingredient required'),
  instructions: z.array(z.string().min(1)).min(1, 'At least one instruction required'),
});

type MealFormData = z.infer<typeof mealSchema>;

export function AdminMealForm({ meal, onSubmit, onCancel, isLoading }: AdminMealFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: meal ? {
      name: meal.name,
      description: meal.description,
      imageUrl: meal.imageUrl,
      category: meal.category,
      difficulty: meal.difficulty,
      preparationTime: meal.preparationTime,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
    } : {
      ingredients: [''],
      instructions: [''],
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

  const handleFormSubmit = async (data: MealFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Meal Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Delicious Pasta"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="A brief description of the meal..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              {...register('imageUrl')}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {MEAL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="capitalize">
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                {...register('difficulty')}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select...</option>
                {DIFFICULTY_LEVELS.map(level => (
                  <option key={level} value={level} className="capitalize">
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Preparation Time (minutes)
            </label>
            <input
              {...register('preparationTime', { valueAsNumber: true })}
              type="number"
              min="1"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="30"
            />
          </div>
        </div>

        <div>
          <div className="glass-card p-4 h-64 flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="text-center text-foreground/40">
                <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                <p>Image preview</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium">
            Ingredients <span className="text-red-500">*</span>
          </label>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => appendIngredient('')}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Ingredient
          </Button>
        </div>
        <div className="space-y-2">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...register(`ingredients.${index}` as const)}
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 2 cups flour"
              />
              {ingredientFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.ingredients && (
          <p className="text-red-500 text-sm mt-1">
            {errors.ingredients.message || errors.ingredients.root?.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium">
            Instructions <span className="text-red-500">*</span>
          </label>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => appendInstruction('')}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Step
          </Button>
        </div>
        <div className="space-y-2">
          {instructionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-medium mt-2">
                {index + 1}
              </span>
              <textarea
                {...register(`instructions.${index}` as const)}
                rows={2}
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Describe this step..."
              />
              {instructionFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.instructions && (
          <p className="text-red-500 text-sm mt-1">
            {errors.instructions.message || errors.instructions.root?.message}
          </p>
        )}
      </div>

      <div className="flex gap-4 pt-4 border-t border-border">
        <Button type="submit" variant="primary" loading={isLoading} fullWidth>
          {meal ? 'Update Meal' : 'Create Meal'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} fullWidth>
          Cancel
        </Button>
      </div>
    </form>
  );
}

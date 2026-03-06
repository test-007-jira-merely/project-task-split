import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X } from 'lucide-react';
import { Meal, MealCategory, MealDifficulty } from '@/types/meal.types';

const mealSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Invalid image URL'),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  prepTime: z.number().min(1).optional(),
  ingredients: z.array(z.string().min(1)).min(1, 'At least one ingredient is required'),
  instructions: z.array(z.string().min(1)).min(1, 'At least one instruction is required'),
});

type MealFormData = z.infer<typeof mealSchema>;

interface AdminMealFormProps {
  meal?: Meal;
  onSubmit: (meal: Omit<Meal, 'id'> | Meal) => void;
  onCancel: () => void;
}

export function AdminMealForm({ meal, onSubmit, onCancel }: AdminMealFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: meal || {
      name: '',
      description: '',
      imageUrl: '',
      category: 'lunch',
      difficulty: 'medium',
      prepTime: undefined,
      ingredients: [''],
      instructions: [''],
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

  const imageUrl = watch('imageUrl');

  const handleFormSubmit = (data: MealFormData) => {
    if (meal) {
      onSubmit({ ...meal, ...data });
    } else {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Name *
          </label>
          <input
            {...register('name')}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Category *
          </label>
          <select
            {...register('category')}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Difficulty
          </label>
          <select
            {...register('difficulty')}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600"
          >
            <option value="">Select...</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Prep Time (minutes)
          </label>
          <input
            {...register('prepTime', { valueAsNumber: true })}
            type="number"
            min="1"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Description *
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Image URL *
        </label>
        <input
          {...register('imageUrl')}
          type="url"
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600"
        />
        {errors.imageUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
        )}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            className="mt-3 w-full max-w-md h-48 object-cover rounded-xl"
          />
        )}
      </div>

      {/* Ingredients */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Ingredients *
          </label>
          <button
            type="button"
            onClick={() => appendIngredient('')}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...register(`ingredients.${index}`)}
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="e.g., 2 cups flour"
              />
              {ingredientFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="p-2 text-slate-600 hover:text-red-600 dark:text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.ingredients && (
          <p className="mt-1 text-sm text-red-600">{errors.ingredients.message}</p>
        )}
      </div>

      {/* Instructions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Instructions *
          </label>
          <button
            type="button"
            onClick={() => appendInstruction('')}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {instructionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <span className="flex-shrink-0 w-8 h-10 flex items-center justify-center text-sm font-medium text-slate-600 dark:text-slate-400">
                {index + 1}.
              </span>
              <input
                {...register(`instructions.${index}`)}
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="Instruction step"
              />
              {instructionFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="p-2 text-slate-600 hover:text-red-600 dark:text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.instructions && (
          <p className="mt-1 text-sm text-red-600">{errors.instructions.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
        >
          {meal ? 'Update Meal' : 'Create Meal'}
        </button>
      </div>
    </form>
  );
}

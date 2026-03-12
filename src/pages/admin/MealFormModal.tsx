import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mealService } from '../../services/mealService';
import type { Meal } from '../../types';

const mealSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  prepTime: z.number().min(1, 'Prep time must be at least 1 minute'),
  imageUrl: z.string().url('Must be a valid URL'),
  ingredients: z.array(z.object({ value: z.string().min(1, 'Ingredient cannot be empty') })).min(1, 'At least one ingredient is required'),
  instructions: z.array(z.object({ value: z.string().min(1, 'Instruction cannot be empty') })).min(1, 'At least one instruction is required'),
});

type MealFormData = z.infer<typeof mealSchema>;

interface MealFormModalProps {
  meal: Meal | null;
  onClose: () => void;
}

export function MealFormModal({ meal, onClose }: MealFormModalProps) {
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState(meal?.imageUrl || '');
  const isEditMode = !!meal;

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: meal?.name || '',
      category: meal?.category || 'breakfast',
      difficulty: meal?.difficulty || 'easy',
      prepTime: meal?.prepTime || 15,
      imageUrl: meal?.imageUrl || '',
      ingredients: meal?.ingredients.map(ing => ({ value: ing })) || [{ value: '' }],
      instructions: meal?.instructions.map(inst => ({ value: inst })) || [{ value: '' }],
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (imageUrl && imageUrl.match(/^https?:\/\/.+/)) {
        setImagePreview(imageUrl);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [imageUrl]);

  const createMutation = useMutation({
    mutationFn: mealService.createMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Meal> }) =>
      mealService.updateMeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      onClose();
    },
  });

  const onSubmit = async (data: MealFormData) => {
    const mealData = {
      name: data.name,
      category: data.category,
      difficulty: data.difficulty,
      prepTime: data.prepTime,
      imageUrl: data.imageUrl,
      ingredients: data.ingredients.map(ing => ing.value),
      instructions: data.instructions.map(inst => inst.value),
    };

    if (isEditMode && meal) {
      await updateMutation.mutateAsync({ id: meal.id, data: mealData });
    } else {
      await createMutation.mutateAsync(mealData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {isEditMode ? 'Edit Meal' : 'Create New Meal'}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  {...register('difficulty')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                {errors.difficulty && (
                  <p className="text-red-600 text-sm mt-1">{errors.difficulty.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prep Time (minutes)
                </label>
                <input
                  type="number"
                  {...register('prepTime', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.prepTime && (
                  <p className="text-red-600 text-sm mt-1">{errors.prepTime.message}</p>
                )}
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                {...register('imageUrl')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://images.unsplash.com/..."
              />
              {errors.imageUrl && (
                <p className="text-red-600 text-sm mt-1">{errors.imageUrl.message}</p>
              )}
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                    onError={() => setImagePreview('')}
                  />
                </div>
              )}
            </div>

            {/* Ingredients */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ingredients
                </label>
                <button
                  type="button"
                  onClick={() => appendIngredient({ value: '' })}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Ingredient
                </button>
              </div>
              <div className="space-y-2">
                {ingredientFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      type="text"
                      {...register(`ingredients.${index}.value`)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 1 cup flour"
                    />
                    {ingredientFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.ingredients && (
                <p className="text-red-600 text-sm mt-1">{errors.ingredients.message}</p>
              )}
            </div>

            {/* Instructions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Instructions
                </label>
                <button
                  type="button"
                  onClick={() => appendInstruction({ value: '' })}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Instruction
                </button>
              </div>
              <div className="space-y-2">
                {instructionFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <span className="flex-shrink-0 px-3 py-2 text-gray-500">
                      {index + 1}.
                    </span>
                    <textarea
                      {...register(`instructions.${index}.value`)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Describe this step..."
                    />
                    {instructionFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.instructions && (
                <p className="text-red-600 text-sm mt-1">{errors.instructions.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Saving...'
                  : isEditMode
                  ? 'Update Meal'
                  : 'Create Meal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

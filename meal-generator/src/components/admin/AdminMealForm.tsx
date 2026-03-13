import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { mealSchema, MealFormData } from '@/schemas/mealSchema';
import { Meal } from '@/types/meal';

interface AdminMealFormProps {
  meal?: Meal;
  onSubmit: (data: MealFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AdminMealForm = ({ meal, onSubmit, onCancel, isLoading }: AdminMealFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: meal ? {
      name: meal.name,
      description: meal.description,
      imageUrl: meal.imageUrl,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      category: meal.category,
      preparationTime: meal.preparationTime,
      difficulty: meal.difficulty,
    } : {
      ingredients: [''],
      instructions: [''],
    },
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control,
    name: 'instructions',
  });

  useEffect(() => {
    if (meal) {
      reset({
        name: meal.name,
        description: meal.description,
        imageUrl: meal.imageUrl,
        ingredients: meal.ingredients,
        instructions: meal.instructions,
        category: meal.category,
        preparationTime: meal.preparationTime,
        difficulty: meal.difficulty,
      });
    }
  }, [meal, reset]);

  return (
    <Card glass>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {meal ? 'Edit Meal' : 'Create New Meal'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Meal Name"
            placeholder="e.g., Classic Margherita Pizza"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Image URL"
            placeholder="https://example.com/image.jpg"
            error={errors.imageUrl?.message}
            {...register('imageUrl')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Describe the meal..."
            className={`
              w-full px-4 py-2.5 rounded-xl
              bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              ${errors.description ? 'border-red-500' : ''}
            `}
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Category
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...register('category')}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <Input
            label="Preparation Time (minutes)"
            type="number"
            placeholder="30"
            error={errors.preparationTime?.message}
            {...register('preparationTime', { valueAsNumber: true })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Difficulty
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...register('difficulty')}
            >
              <option value="">Select difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ingredients
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
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
                  placeholder={`Ingredient ${index + 1}`}
                  error={errors.ingredients?.[index]?.message}
                  {...register(`ingredients.${index}`)}
                />
                {ingredientFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {errors.ingredients && (
            <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {errors.ingredients.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Instructions
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => appendInstruction('')}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {instructionFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <div className="flex-1">
                  <textarea
                    rows={2}
                    placeholder={`Step ${index + 1}`}
                    className={`
                      w-full px-4 py-2.5 rounded-xl
                      bg-white dark:bg-gray-800
                      border border-gray-300 dark:border-gray-600
                      text-gray-900 dark:text-white
                      placeholder-gray-400 dark:placeholder-gray-500
                      focus:outline-none focus:ring-2 focus:ring-primary-500
                    `}
                    {...register(`instructions.${index}`)}
                  />
                </div>
                {instructionFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeInstruction(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {errors.instructions && (
            <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {errors.instructions.message}
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {meal ? 'Update Meal' : 'Create Meal'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

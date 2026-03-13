import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Plus } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import type { Meal } from '../../types/meal'

const mealSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  preparationTime: z.number().min(1).optional(),
  ingredients: z.array(z.object({ value: z.string().min(1) })).min(1, 'At least one ingredient required'),
  instructions: z.array(z.object({ value: z.string().min(1) })).min(1, 'At least one instruction required'),
})

type MealFormData = z.infer<typeof mealSchema>

interface AdminMealFormProps {
  meal?: Meal
  onSubmit: (data: Omit<Meal, 'id'>) => Promise<void>
  onCancel: () => void
}

export const AdminMealForm = ({ meal, onSubmit, onCancel }: AdminMealFormProps) => {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: meal?.name || '',
      description: meal?.description || '',
      imageUrl: meal?.imageUrl || '',
      category: meal?.category || 'lunch',
      difficulty: meal?.difficulty || 'medium',
      preparationTime: meal?.preparationTime,
      ingredients: meal?.ingredients.map((i) => ({ value: i })) || [{ value: '' }],
      instructions: meal?.instructions.map((i) => ({ value: i })) || [{ value: '' }],
    },
  })

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients',
  })

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control,
    name: 'instructions',
  })

  const handleFormSubmit = async (data: MealFormData) => {
    setLoading(true)
    try {
      await onSubmit({
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        category: data.category,
        difficulty: data.difficulty,
        preparationTime: data.preparationTime,
        ingredients: data.ingredients.map((i) => i.value),
        instructions: data.instructions.map((i) => i.value),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Meal Name"
          fullWidth
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Image URL"
          fullWidth
          error={errors.imageUrl?.message}
          {...register('imageUrl')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            {...register('category')}
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
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            {...register('difficulty')}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <Input
          label="Preparation Time (minutes)"
          type="number"
          fullWidth
          {...register('preparationTime', { valueAsNumber: true })}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Ingredients
          </label>
          <Button
            type="button"
            size="sm"
            variant="secondary"
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
                fullWidth
                placeholder={`Ingredient ${index + 1}`}
                {...register(`ingredients.${index}.value`)}
              />
              {ingredientFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeIngredient(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        {errors.ingredients && (
          <p className="mt-2 text-sm text-red-600">{errors.ingredients.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Instructions
          </label>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => appendInstruction({ value: '' })}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {instructionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <div className="flex-shrink-0 w-8 h-10 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-xl font-bold">
                {index + 1}
              </div>
              <textarea
                rows={2}
                placeholder={`Step ${index + 1}`}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                {...register(`instructions.${index}.value`)}
              />
              {instructionFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInstruction(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        {errors.instructions && (
          <p className="mt-2 text-sm text-red-600">{errors.instructions.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} fullWidth>
          {loading ? 'Saving...' : meal ? 'Update Meal' : 'Create Meal'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} fullWidth>
          Cancel
        </Button>
      </div>
    </form>
  )
}

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { mealSchema, type MealFormValues } from '@/utils/validation';
import type { Meal, MealFormData } from '@/types';

interface AdminMealFormProps {
  meal?: Meal;
  onSubmit: (data: MealFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AdminMealForm({ meal, onSubmit, onCancel, isLoading }: AdminMealFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<MealFormValues>({
    resolver: zodResolver(mealSchema),
    defaultValues: meal
      ? {
          name: meal.name,
          description: meal.description,
          imageUrl: meal.imageUrl,
          category: meal.category,
          ingredients: meal.ingredients,
          instructions: meal.instructions,
          preparationTime: meal.preparationTime,
          difficulty: meal.difficulty,
        }
      : {
          name: '',
          description: '',
          imageUrl: '',
          category: 'lunch',
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
    name: 'ingredients' as any,
  });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control,
    name: 'instructions' as any,
  });

  const imageUrl = watch('imageUrl');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-2">Name *</label>
        <Input {...register('name')} placeholder="Meal name" />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <textarea
          {...register('description')}
          placeholder="Describe the meal"
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-input bg-background"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium mb-2">Image URL *</label>
        <Input {...register('imageUrl')} placeholder="https://example.com/image.jpg" />
        {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/128?text=Invalid+URL';
            }}
          />
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-2">Category *</label>
        <select
          {...register('category')}
          className="w-full px-3 py-2 rounded-lg border border-input bg-background"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-medium mb-2">Difficulty</label>
        <select
          {...register('difficulty')}
          className="w-full px-3 py-2 rounded-lg border border-input bg-background"
        >
          <option value="">None</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Preparation Time */}
      <div>
        <label className="block text-sm font-medium mb-2">Preparation Time (minutes)</label>
        <Input
          type="number"
          {...register('preparationTime', { valueAsNumber: true })}
          placeholder="30"
        />
      </div>

      {/* Ingredients */}
      <div>
        <label className="block text-sm font-medium mb-2">Ingredients *</label>
        <div className="space-y-2">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`ingredients.${index}` as const)}
                placeholder="Ingredient"
                className="flex-1"
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendIngredient('')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Ingredient
          </Button>
        </div>
        {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients.message}</p>}
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium mb-2">Instructions *</label>
        <div className="space-y-2">
          {instructionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`instructions.${index}` as const)}
                placeholder={`Step ${index + 1}`}
                className="flex-1"
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendInstruction('')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Instruction
          </Button>
        </div>
        {errors.instructions && <p className="text-red-500 text-sm mt-1">{errors.instructions.message}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : meal ? 'Update Meal' : 'Create Meal'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

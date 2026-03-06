import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Meal } from '@/types/meal';

const mealSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  prepTime: z.number().min(1).optional(),
  ingredients: z.array(z.string().min(1)).min(1, 'At least one ingredient required'),
  instructions: z.array(z.string().min(1)).min(1, 'At least one instruction required'),
});

type MealFormData = z.infer<typeof mealSchema>;

interface AdminMealFormProps {
  meal: Meal | null;
  onSubmit: (data: Omit<Meal, 'id'>) => void;
  isLoading: boolean;
}

export const AdminMealForm = ({ meal, onSubmit, isLoading }: AdminMealFormProps) => {
  const {
    register,
    handleSubmit,
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
      prepTime: meal.prepTime,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('name')}
          label="Meal Name"
          placeholder="Delicious Pancakes"
          error={errors.name?.message}
        />

        <Input
          {...register('imageUrl')}
          label="Image URL"
          placeholder="https://..."
          error={errors.imageUrl?.message}
        />
      </div>

      <Input
        {...register('description')}
        label="Description"
        placeholder="A brief description..."
        error={errors.description?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            {...register('category')}
            className="w-full px-4 py-3 rounded-2xl border border-input bg-background"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Difficulty</label>
          <select
            {...register('difficulty')}
            className="w-full px-4 py-3 rounded-2xl border border-input bg-background"
          >
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
          error={errors.prepTime?.message}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Ingredients</label>
          <Button type="button" size="sm" onClick={() => appendIngredient('')}>
            <Plus size={16} />
          </Button>
        </div>
        <div className="space-y-2">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`ingredients.${index}`)}
                placeholder="flour"
                error={errors.ingredients?.[index]?.message}
              />
              {ingredientFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeIngredient(index)}
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Instructions</label>
          <Button type="button" size="sm" onClick={() => appendInstruction('')}>
            <Plus size={16} />
          </Button>
        </div>
        <div className="space-y-2">
          {instructionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`instructions.${index}`)}
                placeholder="Mix ingredients..."
                error={errors.instructions?.[index]?.message}
              />
              {instructionFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInstruction(index)}
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        {meal ? 'Update Meal' : 'Create Meal'}
      </Button>
    </form>
  );
};

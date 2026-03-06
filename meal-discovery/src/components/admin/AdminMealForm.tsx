import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminMealFormProps } from '@/types/components';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { X } from 'lucide-react';
import { useState } from 'react';

const mealSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url('Must be a valid URL'),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  prepTime: z.number().min(1).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

type MealFormData = z.infer<typeof mealSchema>;

export const AdminMealForm = ({ meal, onSubmit, onCancel }: AdminMealFormProps) => {
  const [ingredients, setIngredients] = useState<string[]>(meal?.ingredients || []);
  const [ingredientInput, setIngredientInput] = useState('');
  const [instructions, setInstructions] = useState<string[]>(meal?.instructions || []);
  const [instructionInput, setInstructionInput] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: meal ? {
      name: meal.name,
      description: meal.description,
      imageUrl: meal.imageUrl,
      category: meal.category,
      prepTime: meal.prepTime,
      difficulty: meal.difficulty,
    } : undefined,
  });

  const handleFormSubmit = async (data: MealFormData) => {
    const mealData = {
      ...data,
      ingredients,
      instructions,
      ...(meal && { id: meal.id }),
    };
    await onSubmit(mealData as any);
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">
        {meal ? 'Edit Meal' : 'Create New Meal'}
      </h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Meal Name"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Image URL"
            error={errors.imageUrl?.message}
            {...register('imageUrl')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...register('category')}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <Input
            label="Prep Time (mins)"
            type="number"
            {...register('prepTime', { valueAsNumber: true })}
          />

          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <select
              className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...register('difficulty')}
            >
              <option value="">Select difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium mb-2">Ingredients</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (ingredientInput.trim()) {
                    setIngredients([...ingredients, ingredientInput.trim()]);
                    setIngredientInput('');
                  }
                }
              }}
              placeholder="Add ingredient..."
              className="flex-1 px-4 py-2 rounded-xl border border-border bg-background"
            />
            <Button
              type="button"
              onClick={() => {
                if (ingredientInput.trim()) {
                  setIngredients([...ingredients, ingredientInput.trim()]);
                  setIngredientInput('');
                }
              }}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900 rounded-full text-sm"
              >
                {ing}
                <button
                  type="button"
                  onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}
                  className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium mb-2">Instructions</label>
          <div className="flex gap-2 mb-2">
            <textarea
              value={instructionInput}
              onChange={(e) => setInstructionInput(e.target.value)}
              placeholder="Add instruction step..."
              className="flex-1 px-4 py-2 rounded-xl border border-border bg-background min-h-[60px]"
            />
            <Button
              type="button"
              onClick={() => {
                if (instructionInput.trim()) {
                  setInstructions([...instructions, instructionInput.trim()]);
                  setInstructionInput('');
                }
              }}
            >
              Add
            </Button>
          </div>
          <ol className="space-y-2">
            {instructions.map((inst, index) => (
              <li key={index} className="flex gap-2 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="flex-1 text-sm">{inst}</span>
                <button
                  type="button"
                  onClick={() => setInstructions(instructions.filter((_, i) => i !== index))}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {meal ? 'Update Meal' : 'Create Meal'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

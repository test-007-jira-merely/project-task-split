import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import type { Meal } from '@types/meal';
import { useState } from 'react';
import { X, Plus } from 'lucide-react';

const mealSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  prepTime: z.number().min(1).optional(),
});

type MealFormData = z.infer<typeof mealSchema>;

interface AdminMealFormProps {
  meal?: Meal;
  onSubmit: (data: MealFormData & { ingredients: string[]; instructions: string[] }) => Promise<void>;
  onCancel: () => void;
}

export function AdminMealForm({ meal, onSubmit, onCancel }: AdminMealFormProps) {
  const [ingredients, setIngredients] = useState<string[]>(meal?.ingredients || []);
  const [ingredientInput, setIngredientInput] = useState('');
  const [instructions, setInstructions] = useState<string[]>(meal?.instructions || []);
  const [instructionInput, setInstructionInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
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
    } : undefined,
  });

  const handleFormSubmit = async (data: MealFormData) => {
    if (ingredients.length === 0 || instructions.length === 0) {
      alert('Please add at least one ingredient and one instruction');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, ingredients, instructions });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addInstruction = () => {
    if (instructionInput.trim()) {
      setInstructions([...instructions, instructionInput.trim()]);
      setInstructionInput('');
    }
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input label="Meal Name" {...register('name')} error={errors.name?.message} />

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <Input label="Image URL" {...register('imageUrl')} error={errors.imageUrl?.message} />

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Category</label>
        <select
          {...register('category')}
          className="w-full px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Difficulty</label>
          <select
            {...register('difficulty')}
            className="w-full px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          >
            <option value="">Select...</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <Input
          label="Prep Time (minutes)"
          type="number"
          {...register('prepTime', { valueAsNumber: true })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Ingredients</label>
        <div className="flex gap-2 mb-2">
          <Input
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
            placeholder="Add ingredient"
          />
          <Button type="button" onClick={addIngredient}>
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <span className="text-sm text-neutral-900 dark:text-neutral-100">{ingredient}</span>
              <Button type="button" size="sm" variant="ghost" onClick={() => removeIngredient(index)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Instructions</label>
        <div className="flex gap-2 mb-2">
          <textarea
            value={instructionInput}
            onChange={(e) => setInstructionInput(e.target.value)}
            placeholder="Add instruction step"
            rows={2}
            className="flex-1 px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          />
          <Button type="button" onClick={addInstruction}>
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="space-y-2">
          {instructions.map((instruction, index) => (
            <div key={index} className="flex items-start justify-between p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <div className="flex gap-2 flex-1">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white text-sm flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-sm text-neutral-900 dark:text-neutral-100">{instruction}</span>
              </div>
              <Button type="button" size="sm" variant="ghost" onClick={() => removeInstruction(index)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {meal ? 'Update Meal' : 'Create Meal'}
        </Button>
      </div>
    </form>
  );
}

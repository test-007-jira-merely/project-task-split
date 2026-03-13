import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Meal } from '../../types';
import { X, Plus } from 'lucide-react';
import { useState } from 'react';

const mealSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  prepTime: z.number().min(0).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

type MealFormData = z.infer<typeof mealSchema>;

interface AdminMealFormProps {
  meal?: Meal;
  onSubmit: (data: Omit<Meal, 'id' | 'created_at'>) => Promise<void>;
  onCancel: () => void;
}

export const AdminMealForm = ({ meal, onSubmit, onCancel }: AdminMealFormProps) => {
  const [ingredients, setIngredients] = useState<string[]>(meal?.ingredients || []);
  const [newIngredient, setNewIngredient] = useState('');
  const [instructions, setInstructions] = useState<string[]>(meal?.instructions || []);
  const [newInstruction, setNewInstruction] = useState('');
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
      prepTime: meal.prepTime,
      difficulty: meal.difficulty,
    } : undefined,
  });

  const handleFormSubmit = async (data: MealFormData) => {
    if (ingredients.length === 0 || instructions.length === 0) {
      alert('Please add at least one ingredient and one instruction');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        ingredients,
        instructions,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addInstruction = () => {
    if (newInstruction.trim()) {
      setInstructions([...instructions, newInstruction.trim()]);
      setNewInstruction('');
    }
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 p-6">
      <Input
        label="Meal Name"
        placeholder="Enter meal name"
        error={errors.name?.message}
        {...register('name')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={3}
          placeholder="Describe the meal"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
        )}
      </div>

      <Input
        label="Image URL"
        placeholder="https://example.com/image.jpg"
        error={errors.imageUrl?.message}
        {...register('imageUrl')}
      />

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            {...register('category')}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prep Time (min)
          </label>
          <input
            type="number"
            {...register('prepTime', { valueAsNumber: true })}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty
          </label>
          <select
            {...register('difficulty')}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select...</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ingredients
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
            placeholder="Add ingredient"
            className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button type="button" onClick={addIngredient} size="md">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-xl"
            >
              <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
              >
                <X className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Instructions
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newInstruction}
            onChange={(e) => setNewInstruction(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInstruction())}
            placeholder="Add instruction step"
            className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button type="button" onClick={addInstruction} size="md">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="space-y-2">
          {instructions.map((instruction, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-xl"
            >
              <div className="flex gap-2">
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  {index + 1}.
                </span>
                <span className="text-gray-700 dark:text-gray-300">{instruction}</span>
              </div>
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
              >
                <X className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1" isLoading={isSubmitting}>
          {meal ? 'Update Meal' : 'Create Meal'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

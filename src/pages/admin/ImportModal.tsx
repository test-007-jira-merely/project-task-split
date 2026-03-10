import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mealService } from '../../services/mealService';

interface ImportModalProps {
  onClose: () => void;
}

export function ImportModal({ onClose }: ImportModalProps) {
  const queryClient = useQueryClient();
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const importMutation = useMutation({
    mutationFn: mealService.importMeals,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setSuccessMessage(`Successfully imported ${data.count} meals!`);
      setJsonInput('');
      setError('');
      setTimeout(() => {
        onClose();
      }, 2000);
    },
    onError: (err: Error) => {
      setError(`Import failed: ${err.message}`);
      setSuccessMessage('');
    },
  });

  const handleImport = () => {
    setError('');
    setSuccessMessage('');

    try {
      // Parse and validate JSON
      const parsedData = JSON.parse(jsonInput);

      // Check if it's an array
      if (!Array.isArray(parsedData)) {
        throw new Error('JSON must be an array of meal objects');
      }

      // Validate each meal has required fields
      const requiredFields = ['name', 'category', 'difficulty', 'prepTime', 'imageUrl', 'ingredients', 'instructions'];

      for (let i = 0; i < parsedData.length; i++) {
        const meal = parsedData[i];
        for (const field of requiredFields) {
          if (!(field in meal)) {
            throw new Error(`Meal at index ${i} is missing required field: ${field}`);
          }
        }

        // Validate field types
        if (typeof meal.name !== 'string' || meal.name.trim() === '') {
          throw new Error(`Meal at index ${i} has invalid name`);
        }

        if (!['breakfast', 'lunch', 'dinner', 'snack'].includes(meal.category)) {
          throw new Error(`Meal at index ${i} has invalid category: ${meal.category}`);
        }

        if (!['easy', 'medium', 'hard'].includes(meal.difficulty)) {
          throw new Error(`Meal at index ${i} has invalid difficulty: ${meal.difficulty}`);
        }

        if (typeof meal.prepTime !== 'number' || meal.prepTime < 1) {
          throw new Error(`Meal at index ${i} has invalid prepTime`);
        }

        if (typeof meal.imageUrl !== 'string' || !meal.imageUrl.match(/^https?:\/\/.+/)) {
          throw new Error(`Meal at index ${i} has invalid imageUrl`);
        }

        if (!Array.isArray(meal.ingredients) || meal.ingredients.length === 0) {
          throw new Error(`Meal at index ${i} has invalid ingredients array`);
        }

        if (!Array.isArray(meal.instructions) || meal.instructions.length === 0) {
          throw new Error(`Meal at index ${i} has invalid instructions array`);
        }
      }

      // If validation passes, trigger import
      importMutation.mutate(parsedData);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format. Please check your input.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleLoadSample = async () => {
    try {
      const response = await fetch('/seed-data/meals.json');
      const data = await response.json();
      setJsonInput(JSON.stringify(data, null, 2));
      setError('');
      setSuccessMessage('Sample data loaded! Click "Import Meals" to proceed.');
    } catch (err) {
      setError('Failed to load sample data. Make sure meals.json is in the seed-data folder.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Import Meals</h2>

          <p className="text-gray-600 mb-4">
            Paste JSON array of meal objects below. Each meal should have: name, category, difficulty,
            prepTime, imageUrl, ingredients (array), and instructions (array).
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm">{successMessage}</p>
            </div>
          )}

          <div className="mb-4">
            <button
              onClick={handleLoadSample}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Load sample data from seed-data/meals.json
            </button>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder={`[\n  {\n    "name": "Pancakes",\n    "category": "breakfast",\n    "difficulty": "easy",\n    "prepTime": 15,\n    "imageUrl": "https://...",\n    "ingredients": ["1 cup flour", "..."],\n    "instructions": ["Mix ingredients", "..."]\n  }\n]`}
          />

          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="text-sm text-gray-500">
              {jsonInput && `${jsonInput.split('\n').length} lines`}
            </div>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!jsonInput.trim() || importMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {importMutation.isPending ? 'Importing...' : 'Import Meals'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

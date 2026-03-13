import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, FileJson } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { mealService } from '@/services/mealService';

export default function AdminImport() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: mealService.importMeals,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setSuccess('Meals imported successfully!');
      setFile(null);
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to import meals');
      setTimeout(() => setError(''), 3000);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/json') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a JSON file');
        setFile(null);
      }
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      const text = await file.text();
      const meals = JSON.parse(text);

      if (!Array.isArray(meals)) {
        setError('Invalid JSON format: expected an array');
        return;
      }

      await importMutation.mutateAsync(meals);
    } catch (err) {
      setError('Invalid JSON file');
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-foreground mb-2">Import Meals</h1>
        <p className="text-muted-foreground">Upload a JSON file to import meals into the database</p>
      </motion.div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400">
          {success}
        </div>
      )}

      <Card className="space-y-6">
        <div className="space-y-4">
          <label className="block">
            <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-accent transition-colors">
              <div className="text-center space-y-2">
                <FileJson size={48} className="mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to select or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">JSON files only</p>
              </div>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {file && (
            <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
              <div className="flex items-center space-x-3">
                <FileJson size={24} className="text-primary-600" />
                <span className="font-medium">{file.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFile(null)}
              >
                Remove
              </Button>
            </div>
          )}
        </div>

        <Button
          onClick={handleImport}
          disabled={!file}
          isLoading={importMutation.isPending}
          className="w-full"
        >
          <Upload size={20} className="mr-2" />
          Import Meals
        </Button>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-foreground mb-2">JSON Format Example</h3>
        <pre className="text-xs text-muted-foreground overflow-x-auto">
{`[
  {
    "name": "Meal Name",
    "description": "Description",
    "imageUrl": "https://...",
    "ingredients": ["ingredient1", "ingredient2"],
    "instructions": ["step1", "step2"],
    "category": "breakfast|lunch|dinner|snack",
    "preparationTime": 30,
    "difficulty": "easy|medium|hard"
  }
]`}
        </pre>
      </Card>
    </div>
  );
}
